<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\PayrollStatusEnum;
use App\Interfaces\IPayrollRepository;
use App\Models\PayrollPeriod;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class PayrollService
{
    public function __construct(
        protected IPayrollRepository $payrollRepository,
        protected SalaryCalculationService $salaryCalculationService
    ) {}

    /**
     * Tüm bordro dönemlerini getirir.
     */
    public function getAll(array $filters = [], array $with = ['creator', 'approvals'])
    {
        return $this->payrollRepository->getAll($filters, $with);
    }

    /**
     * Paginated bordro dönemlerini getirir.
     */
    public function getPaginated(array $filters = [], array $with = ['creator'], int $perPage = 15)
    {
        return $this->payrollRepository->getPaginated($filters, $with, $perPage);
    }

    /**
     * ID ile bordro dönemi getirir.
     */
    public function getById(int $id, array $with = ['creator', 'approvals.approver', 'payrollItems.employee', 'payrollItems.salaryComponent'])
    {
        return $this->payrollRepository->getById($id, $with);
    }

    /**
     * Bordro dönemi oluşturur.
     */
    public function create(array $data): PayrollPeriod
    {
        return $this->payrollRepository->create($data);
    }

    /**
     * Bordro dönemi günceller.
     */
    public function update(int $id, array $data): PayrollPeriod
    {
        $period = $this->payrollRepository->getById($id);

        if ($period && $period->status !== PayrollStatusEnum::DRAFT) {
            throw new \Exception('Sadece taslak durumundaki bordro dönemleri güncellenebilir.');
        }

        return $this->payrollRepository->update($id, $data);
    }

    /**
     * Bordro dönemi siler.
     */
    public function delete(int $id): bool
    {
        $period = $this->payrollRepository->getById($id);

        if ($period && $period->status !== PayrollStatusEnum::DRAFT) {
            throw new \Exception('Sadece taslak durumundaki bordro dönemleri silinebilir.');
        }

        return $this->payrollRepository->delete($id);
    }

    /**
     * Bordro dönemine göre bordro kalemlerini oluşturur.
     */
    public function generatePayrollItems(int $periodId): Collection
    {
        $period = $this->payrollRepository->getById($periodId);

        if (! $period) {
            throw new \Exception('Bordro dönemi bulunamadı.');
        }

        if ($period->status !== PayrollStatusEnum::DRAFT) {
            throw new \Exception('Sadece taslak durumundaki bordro dönemleri için kalem oluşturulabilir.');
        }

        // Dönem içindeki aktif çalışanları al (tek seferde hepsini yükle)
        $employees = $period->employeesInPeriod()->get();
        $employeeIds = $employees->pluck('id')->toArray();

        // Tüm çalışanların maaş yapılandırmasını toplu olarak al
        $employeeSalaries = DB::table('employee_salaries')
            ->whereIn('employee_id', $employeeIds)
            ->where('start_date', '<=', $period->start_date)
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $period->start_date);
            })
            ->join('salary_components', 'employee_salaries.salary_component_id', '=', 'salary_components.id')
            ->select([
                'employee_salaries.employee_id',
                'employee_salaries.salary_component_id',
                'employee_salaries.amount',
                'salary_components.name as component_name',
            ])
            ->get();

        $items = [];

        DB::beginTransaction();
        try {
            // Mevcut kalemleri sil
            $period->payrollItems()->delete();

            // Toplu insert için satırları hazırla
            $rows = [];
            foreach ($employeeSalaries as $salary) {
                $rows[] = [
                    'payroll_period_id' => $periodId,
                    'employee_id' => $salary->employee_id,
                    'salary_component_id' => $salary->salary_component_id,
                    'amount' => $salary->amount,
                    'calculated_amount' => $salary->amount,
                    'quantity' => 1,
                    'unit_price' => $salary->amount,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            if (! empty($rows)) {
                DB::table('payroll_items')->insert($rows);
                $items = DB::table('payroll_items')
                    ->where('payroll_period_id', $periodId)
                    ->get();
            }

            DB::commit();

            return collect($items);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Bordro dönemini yayınlar.
     */
    public function publish(int $periodId): PayrollPeriod
    {
        return $this->payrollRepository->publish($periodId);
    }

    /**
     * Bordro dönemini onaylar.
     */
    public function approve(int $periodId, int $userId, string $role, ?string $comment = null): PayrollPeriod
    {
        return $this->payrollRepository->approve($periodId, $userId, $role, $comment);
    }

    /**
     * Bordro dönemini reddeder.
     */
    public function reject(int $periodId, int $userId, string $role, string $comment): PayrollPeriod
    {
        $period = $this->payrollRepository->getById($periodId);

        $period->approvals()->create([
            'approver_id' => $userId,
            'role' => $role,
            'status' => 'rejected',
            'comment' => $comment,
            'approved_at' => now(),
        ]);

        // Statusu taslağa geri çek
        $period->update(['status' => PayrollStatusEnum::DRAFT->value]);

        return $period->fresh();
    }

    /**
     * Mevcut dönemi getirir.
     */
    public function getCurrentPeriod(): ?PayrollPeriod
    {
        return $this->payrollRepository->getCurrentPeriod();
    }
}
