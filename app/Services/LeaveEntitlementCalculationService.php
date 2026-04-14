<?php

declare(strict_types=1);

namespace App\Services;

use App\Interfaces\ILeaveEntitlementRepository;
use App\Models\Employee;
use Carbon\Carbon;

class LeaveEntitlementCalculationService
{
    public function __construct(
        protected ILeaveEntitlementRepository $leaveEntitlementRepository
    ) {}

    /**
     * Çalışanın yıllık izin hakkını hesaplar (İş Kanunu Madde 53)
     */
    public function calculateAnnualLeaveDays(Employee $employee, string $year): int
    {
        $hireDate = Carbon::parse($employee->hire_date);
        $currentDate = Carbon::parse($year.'-12-31');
        $tenureYears = $hireDate->diffInYears($currentDate);

        // Normal yıllık izin hakkı
        if ($tenureYears < 5) {
            $baseDays = 14;
        } elseif ($tenureYears < 15) {
            $baseDays = 20;
        } else {
            $baseDays = 26;
        }

        // Yaş bazlı ek haklar
        $birthDate = Carbon::parse($employee->birth_date);
        $age = $birthDate->diffInYears($currentDate);

        // 18 yaş altı çalışanlar için ek 2 gün
        if ($age < 18) {
            $baseDays += 2;
        }

        // 50 yaş üstü çalışanlar için ek 2 gün
        if ($age >= 50) {
            $baseDays += 2;
        }

        // Yıl içinde işe girenler için proportional hesaplama
        if ($hireDate->year == $currentDate->year) {
            $daysWorked = $hireDate->diffInDays($currentDate);
            $totalYearDays = 365;
            $baseDays = floor(($baseDays * $daysWorked) / $totalYearDays);
        }

        return max(0, $baseDays);
    }

    /**
     * Çalışan için izin hakkı oluşturur veya günceller
     */
    public function createOrUpdateEntitlement(Employee $employee, string $year, int $leaveTypeId): void
    {
        $entitledDays = $this->calculateAnnualLeaveDays($employee, $year);

        $existing = $this->leaveEntitlementRepository->getByEmployeeAndYear($employee->id, $year)
            ->firstWhere('leave_type_id', $leaveTypeId);

        if ($existing) {
            // Güncellemek yerine sadece kullanılmayan günleri kontrol et
            // Haklar her yıl yeniden hesaplanmaz, sadece yeni yıl için oluşturulur
            return;
        }

        // Yeni yıl için izin hakkı oluştur
        $hireDate = Carbon::parse($employee->hire_date);
        $calculationYearStart = Carbon::create($year, 1, 1);
        $accrualDate = $hireDate->copy()->addYear();

        // Eğer çalışan bu yıldan önce işe başladıysa, yıl başından itibaren hak kazanır
        if ($hireDate->year < $year) {
            $accrualDate = $calculationYearStart;
        }

        $this->leaveEntitlementRepository->create([
            'employee_id' => $employee->id,
            'leave_type_id' => $leaveTypeId,
            'entitled_days' => $entitledDays,
            'used_days' => 0,
            'calculation_year_start' => $calculationYearStart->toDateString(),
            'accrual_date' => $accrualDate->toDateString(),
            'can_carry_over' => true,
            'max_carry_over_days' => 182, // 6 ay
        ]);
    }
}
