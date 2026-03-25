<?php

namespace App\Services;

use App\Enums\ApprovalRoleEnum;
use App\Enums\PayrollStatusEnum;
use App\Interfaces\IPayrollRepository;
use App\Models\PayrollApproval;
use App\Models\PayrollPeriod;

class PayrollApprovalService
{
    public function __construct(
        protected IPayrollRepository $payrollRepository
    ) {}

    /**
     * Bordro onay akışını başlatır.
     */
    public function initiateApproval(int $periodId, int $userId): PayrollPeriod
    {
        $period = $this->payrollRepository->getById($periodId);

        if (! $period) {
            throw new \Exception('Bordro dönemi bulunamadı.');
        }

        if ($period->status !== PayrollStatusEnum::DRAFT->value) {
            throw new \Exception('Sadece taslak durumundaki bordrolar onaya sunulabilir.');
        }

        // İlk onay olarak manager onayını bekle
        $period->update(['status' => PayrollStatusEnum::MANAGER_APPROVED->value]);

        return $period->fresh();
    }

    /**
     * Bordro onayı verir.
     */
    public function approve(int $periodId, int $userId, ApprovalRoleEnum $role, ?string $comment = null): PayrollPeriod
    {
        $period = $this->payrollRepository->getById($periodId);

        if (! $period) {
            throw new \Exception('Bordro dönemi bulunamadı.');
        }

        $currentStatus = PayrollStatusEnum::from($period->status);

        // Uygun onay rolü kontrolü
        $expectedStatus = $role->correspondingPayrollStatus();

        if ($currentStatus !== $expectedStatus) {
            throw new \Exception("Bu aşamada {$role->label()} onayı beklenmiyor.");
        }

        // Onay kaydı oluştur
        PayrollApproval::create([
            'payroll_period_id' => $periodId,
            'approver_id' => $userId,
            'role' => $role->value,
            'status' => 'approved',
            'comment' => $comment,
            'approved_at' => now(),
        ]);

        // Sonraki duruma geç
        $nextStatus = $currentStatus->nextStatus();

        if ($nextStatus) {
            $period->update(['status' => $nextStatus->value]);
        }

        return $period->fresh();
    }

    /**
     * Bordro onayını reddeder.
     */
    public function reject(int $periodId, int $userId, ApprovalRoleEnum $role, string $reason): PayrollPeriod
    {
        $period = $this->payrollRepository->getById($periodId);

        if (! $period) {
            throw new \Exception('Bordro dönemi bulunamadı.');
        }

        // Red kaydı oluştur
        PayrollApproval::create([
            'payroll_period_id' => $periodId,
            'approver_id' => $userId,
            'role' => $role->value,
            'status' => 'rejected',
            'comment' => $reason,
            'approved_at' => now(),
        ]);

        // Taslak durumuna geri al
        $period->update(['status' => PayrollStatusEnum::DRAFT->value]);

        return $period->fresh();
    }

    /**
     * Onay durumunu kontrol eder.
     */
    public function getApprovalStatus(int $periodId): array
    {
        $period = $this->payrollRepository->getById($periodId, ['approvals.approver']);

        if (! $period) {
            throw new \Exception('Bordro dönemi bulunamadı.');
        }

        $approvals = $period->approvals;

        return [
            'period_id' => $periodId,
            'current_status' => $period->status,
            'current_status_label' => PayrollStatusEnum::from($period->status)->label(),
            'approvals' => [
                'manager' => $approvals->firstWhere('role', 'manager'),
                'hr' => $approvals->firstWhere('role', 'hr'),
                'accounting' => $approvals->firstWhere('role', 'accounting'),
            ],
            'can_approve' => $this->canApprove($period),
            'next_step' => $this->getNextApprovalStep($period),
        ];
    }

    /**
     * Belirli bir rol onay verebilir mi kontrol eder.
     */
    public function canApprove(PayrollPeriod $period): bool
    {
        $currentStatus = PayrollStatusEnum::from($period->status);

        // Yayınlanmış bordro onaylanamaz
        if ($currentStatus === PayrollStatusEnum::PUBLISHED) {
            return false;
        }

        // Her durumda bir sonraki adım onaylanabilir olmalı
        return $currentStatus->isInApprovalProcess();
    }

    /**
     * Sonraki onay adımını getirir.
     */
    public function getNextApprovalStep(PayrollPeriod $period): ?array
    {
        $currentStatus = PayrollStatusEnum::from($period->status);

        return match ($currentStatus) {
            PayrollStatusEnum::DRAFT => [
                'role' => 'manager',
                'role_label' => 'Yönetici',
                'required_status' => PayrollStatusEnum::MANAGER_APPROVED->value,
            ],
            PayrollStatusEnum::MANAGER_APPROVED => [
                'role' => 'hr',
                'role_label' => 'İnsan Kaynakları',
                'required_status' => PayrollStatusEnum::HR_APPROVED->value,
            ],
            PayrollStatusEnum::HR_APPROVED => [
                'role' => 'accounting',
                'role_label' => 'Muhasebe',
                'required_status' => PayrollStatusEnum::ACCOUNTING_APPROVED->value,
            ],
            PayrollStatusEnum::ACCOUNTING_APPROVED => [
                'role' => 'publish',
                'role_label' => 'Yayınla',
                'required_status' => PayrollStatusEnum::PUBLISHED->value,
            ],
            default => null,
        };
    }

    /**
     * Bordroyu yayınlar.
     */
    public function publish(int $periodId): PayrollPeriod
    {
        $period = $this->payrollRepository->getById($periodId);

        if (! $period) {
            throw new \Exception('Bordro dönemi bulunamadı.');
        }

        $currentStatus = PayrollStatusEnum::from($period->status);

        if ($currentStatus !== PayrollStatusEnum::ACCOUNTING_APPROVED) {
            throw new \Exception('Muhasebe onayı verilmeden bordro yayınlanamaz.');
        }

        $period->update(['status' => PayrollStatusEnum::PUBLISHED->value]);

        // Çalışanlara e-posta gönder
        $this->sendPublishedEmails($period);

        return $period->fresh();
    }

    /**
     * Yayınlanan bordro için çalışanlara e-posta gönderir.
     */
    protected function sendPublishedEmails(PayrollPeriod $period): void
    {
        $employees = $period->employeesInPeriod()->get();

        foreach ($employees as $employee) {
            if ($employee->email) {
                // Bireysel e-posta gönderimi
                // Not: Toplu gönderim için queue kullanılmalı
            }
        }
    }
}
