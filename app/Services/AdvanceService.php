<?php

namespace App\Services;

use App\Interfaces\IAdvanceRepository;
use App\Models\AdvanceDeduction;
use App\Models\AdvanceRequest;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Mail;

class AdvanceService
{
    public function __construct(
        protected IAdvanceRepository $advanceRepository
    ) {}

    /**
     * Tüm avans taleplerini getirir.
     */
    public function getAll(array $filters = [], array $with = ['employee', 'approver'])
    {
        return $this->advanceRepository->getAll($filters, $with);
    }

    /**
     * Paginated avans taleplerini getirir.
     */
    public function getPaginated(array $filters = [], array $with = ['employee'], int $perPage = 15)
    {
        return $this->advanceRepository->getPaginated($filters, $with, $perPage);
    }

    /**
     * ID ile avans talebi getirir.
     */
    public function getById(int $id, array $with = ['employee', 'approver', 'deductions.payrollPeriod'])
    {
        return $this->advanceRepository->getById($id, $with);
    }

    /**
     * Yeni avans talebi oluşturur.
     */
    public function create(array $data): AdvanceRequest
    {
        // Çalışanın daha önce onaylanmış ve ödenmemiş avansı var mı kontrolü
        $existingAdvance = $this->advanceRepository->getAll([
            'employee_id' => $data['employee_id'],
            'status' => 'approved',
        ]);

        $totalUnpaid = $existingAdvance->sum('amount') - $existingAdvance->sum(function ($advance) {
            return $advance->deductions()->where('status', 'deducted')->sum('deduction_amount');
        });

        // Yeni talep + ödenmemiş toplam, brüt maaşın 3 katını geçemez
        // Bu kontrol SalaryCalculationService ile entegre edilebilir

        return $this->advanceRepository->create($data);
    }

    /**
     * Avans talebini günceller.
     */
    public function update(int $id, array $data): AdvanceRequest
    {
        $advance = $this->advanceRepository->getById($id);

        if ($advance && $advance->status !== 'pending') {
            throw new \Exception('Sadece bekleyen avans talepleri güncellenebilir.');
        }

        return $this->advanceRepository->update($id, $data);
    }

    /**
     * Avans talebini siler.
     */
    public function delete(int $id): bool
    {
        $advance = $this->advanceRepository->getById($id);

        if ($advance && $advance->status !== 'pending') {
            throw new \Exception('Sadece bekleyen avans talepleri silinebilir.');
        }

        return $this->advanceRepository->delete($id);
    }

    /**
     * Avans talebini onaylar.
     */
    public function approve(int $id, int $approverId): AdvanceRequest
    {
        $advance = $this->advanceRepository->approve($id, $approverId);

        // E-posta gönder
        $this->sendApprovalEmail($advance);

        return $advance;
    }

    /**
     * Avans talebini reddeder.
     */
    public function reject(int $id, int $approverId, string $reason): AdvanceRequest
    {
        $advance = $this->advanceRepository->reject($id, $approverId, $reason);

        // E-posta gönder
        $this->sendRejectionEmail($advance);

        return $advance;
    }

    /**
     * Avansı ödenmiş olarak işaretler.
     */
    public function markAsPaid(int $id, ?string $paymentDate = null): AdvanceRequest
    {
        return $this->advanceRepository->markAsPaid($id, $paymentDate);
    }

    /**
     * Avans talebini iptal eder.
     */
    public function cancel(int $id): AdvanceRequest
    {
        $advance = $this->advanceRepository->getById($id);

        if ($advance && ! in_array($advance->status, ['pending', 'approved'])) {
            throw new \Exception('Sadece bekleyen veya onaylanmış avans talepleri iptal edilebilir.');
        }

        // Ödenmişse kesintileri de iptal et
        if ($advance->status === 'paid') {
            $advance->deductions()->update(['status' => 'cancelled']);
        }

        return $this->advanceRepository->cancel($id);
    }

    /**
     * Avans kesintisi oluşturur (bordro döneminde).
     */
    public function createDeduction(int $advanceId, int $payrollPeriodId, float $deductionAmount): AdvanceDeduction
    {
        $advance = $this->advanceRepository->getById($advanceId);

        if (! $advance) {
            throw new \Exception('Avans talebi bulunamadı.');
        }

        if ($advance->status !== 'approved' && $advance->status !== 'paid') {
            throw new \Exception('Sadece onaylanmış avanslar için kesinti oluşturulabilir.');
        }

        $remainingAmount = $advance->amount - $advance->deductions()->where('status', '!=', 'cancelled')->sum('deduction_amount');

        if ($deductionAmount > $remainingAmount) {
            throw new \Exception('Kesinti tutarı kalan tutarı aşıyor.');
        }

        $deduction = AdvanceDeduction::create([
            'advance_request_id' => $advanceId,
            'payroll_period_id' => $payrollPeriodId,
            'deduction_amount' => $deductionAmount,
            'remaining_amount' => $remainingAmount - $deductionAmount,
            'status' => 'pending',
        ]);

        // Tümü kesildiyse tamamlandı işaretle
        $newRemaining = $remainingAmount - $deductionAmount;
        if ($newRemaining <= 0) {
            $deduction->update(['status' => 'deducted', 'deduction_date' => now()->toDateString()]);
            $advance->update(['status' => 'paid']);
        }

        return $deduction;
    }

    /**
     * Çalışanın avans taleplerini getirir.
     */
    public function getByEmployee(int $employeeId): Collection
    {
        return $this->advanceRepository->getByEmployee($employeeId);
    }

    /**
     * Bekleyen talepleri getirir.
     */
    public function getPending(): Collection
    {
        return $this->advanceRepository->getPending();
    }

    /**
     * Onay e-postası gönderir.
     */
    protected function sendApprovalEmail(AdvanceRequest $advance): void
    {
        if ($advance->employee->email) {
            Mail::to($advance->employee->email)
                ->send(new \App\Mail\AdvanceApprovedMailable($advance));
        }
    }

    /**
     * Red e-postası gönderir.
     */
    protected function sendRejectionEmail(AdvanceRequest $advance): void
    {
        if ($advance->employee->email) {
            Mail::to($advance->employee->email)
                ->send(new \App\Mail\AdvanceRejectedMailable($advance));
        }
    }
}
