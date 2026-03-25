<?php

namespace App\Services;

use App\Interfaces\IEmployeeSalaryRepository;
use App\Models\Employee;
use App\Models\PayrollPeriod;

/**
 * Maaş Hesaplama Servisi
 *
 * 2025 yılı vergi ve SGK parametreleri kullanılmaktadır.
 * - Gelir vergisi dilimleri
 * - SGK işçi payı ve işveren payı
 * - Damga vergisi
 * - İşsizlik sigortası
 */
class SalaryCalculationService
{
    // 2025 SGK ve Vergi Parametreleri

    // SGK İşçi Payı Oranları
    public const SGK_EMPLOYEE_PREMIUM_RATE = 0.14; // %14 - Genel sağlık sigortası

    public const UNEMPLOYMENT_EMPLOYEE_RATE = 0.02; // %2 - İşsizlik sigortası

    // SGK İşveren Payı Oranları
    public const SGK_EMPLOYER_PREMIUM_RATE = 0.255; // %25.5 - İşveren payı (işçi + işveren toplam)

    public const UNEMPLOYMENT_EMPLOYER_RATE = 0.03; // %3 - İşsizlik sigortası işveren payı

    // Damga Vergisi
    public const STAMP_TAX_RATE = 0.00659; // %0.659

    // Gelir Vergisi Dilimleri (2025)
    public const TAX_BRACKETS = [
        ['min' => 0, 'max' => 110000, 'rate' => 0.15],      // %15 - İlk dilim
        ['min' => 110000, 'max' => 230000, 'rate' => 0.20], // %20 - İkinci dilim
        ['min' => 230000, 'max' => 580000, 'rate' => 0.27], // %27 - Üçüncü dilim
        ['min' => 580000, 'max' => 3000000, 'rate' => 0.35], // %35 - Dördüncü dilim
        ['min' => 3000000, 'max' => PHP_INT_MAX, 'rate' => 0.40], // %40 - Beşinci dilim
    ];

    // Asgari Ücret (2025 - Aylık)
    public const MINIMUM_WAGE_MONTHLY = 22650.00;

    // SGK Tavan ve Taban (2025)
    public const SGK_MIN_MONTHLY = 22650.00;

    public const SGK_MAX_MONTHLY = 170130.00;

    public function __construct(
        protected IEmployeeSalaryRepository $employeeSalaryRepository
    ) {}

    /**
     * Çalışanın brüt maaşını hesaplar.
     */
    public function calculateGrossSalary(Employee $employee, ?string $date = null): float
    {
        $date = $date ?? now()->toDateString();

        $salaries = $this->employeeSalaryRepository->getActiveByEmployee($employee->id, $date);

        // Sadece kazanç kalemlerini al
        $earnings = $salaries->filter(function ($salary) {
            return $salary->salaryComponent->type === 'earning';
        });

        return (float) $earnings->sum('amount');
    }

    /**
     * SGK matrahını hesaplar.
     */
    public function calculateSgkMatrah(float $grossSalary): float
    {
        // SGK tavan ve taban kontrolü
        $sgkMatrah = $grossSalary;

        if ($sgkMatrah < self::SGK_MIN_MONTHLY) {
            $sgkMatrah = self::SGK_MIN_MONTHLY;
        } elseif ($sgkMatrah > self::SGK_MAX_MONTHLY) {
            $sgkMatrah = self::SGK_MAX_MONTHLY;
        }

        return $sgkMatrah;
    }

    /**
     * SGK işçi payını hesaplar.
     */
    public function calculateSgkEmployeeShare(float $grossSalary): array
    {
        $sgkMatrah = $this->calculateSgkMatrah($grossSalary);

        $healthPremium = $sgkMatrah * self::SGK_EMPLOYEE_PREMIUM_RATE;
        $unemploymentPremium = $sgkMatrah * self::UNEMPLOYMENT_EMPLOYEE_RATE;

        return [
            'health_premium' => round($healthPremium, 2),
            'unemployment_premium' => round($unemploymentPremium, 2),
            'total' => round($healthPremium + $unemploymentPremium, 2),
        ];
    }

    /**
     * SGK işveren payını hesaplar.
     */
    public function calculateSgkEmployerShare(float $grossSalary): array
    {
        $sgkMatrah = $this->calculateSgkMatrah($grossSalary);

        $employerPremium = $sgkMatrah * self::SGK_EMPLOYER_PREMIUM_RATE;
        $unemploymentEmployer = $sgkMatrah * self::UNEMPLOYMENT_EMPLOYER_RATE;

        return [
            'employer_premium' => round($employerPremium, 2),
            'unemployment_employer' => round($unemploymentEmployer, 2),
            'total' => round($employerPremium + $unemploymentEmployer, 2),
        ];
    }

    /**
     * Gelir vergisi matrahını hesaplar.
     */
    public function calculateIncomeTaxMatrah(float $grossSalary, float $sgkEmployeeShare): float
    {
        // SGK işçi payı düşüldükten sonra vergi matrahı
        // Ayrıca işverenden alınan yemek, yol vb. istisnalar varsa eklenebilir
        $matrah = $grossSalary - $sgkEmployeeShare;

        return max(0, $matrah);
    }

    /**
     * Gelir vergisini hesaplar (progresif dilim sistemi).
     */
    public function calculateIncomeTax(float $annualMatrah): float
    {
        $totalTax = 0;
        $remainingMatrah = $annualMatrah;

        foreach (self::TAX_BRACKETS as $bracket) {
            if ($remainingMatrah <= 0) {
                break;
            }

            $taxableInBracket = min($remainingMatrah, $bracket['max'] - $bracket['min']);
            $totalTax += $taxableInBracket * $bracket['rate'];
            $remainingMatrah -= $taxableInBracket;
        }

        return round($totalTax, 2);
    }

    /**
     * Aylık gelir vergisini hesaplar.
     */
    public function calculateMonthlyIncomeTax(float $monthlyMatrah): float
    {
        // Yıllık matraha çevir (x12)
        $annualMatrah = $monthlyMatrah * 12;
        $annualTax = $this->calculateIncomeTax($annualMatrah);

        return round($annualTax / 12, 2);
    }

    /**
     * Damga vergisini hesaplar.
     */
    public function calculateStampTax(float $grossSalary): float
    {
        return round($grossSalary * self::STAMP_TAX_RATE, 2);
    }

    /**
     * Tüm kesintileri hesaplar.
     */
    public function calculateAllDeductions(Employee $employee, ?string $date = null): array
    {
        $grossSalary = $this->calculateGrossSalary($employee, $date);

        // SGK işçi payı
        $sgkEmployee = $this->calculateSgkEmployeeShare($grossSalary);

        // Gelir vergisi matrahı
        $incomeTaxMatrah = $this->calculateIncomeTaxMatrah($grossSalary, $sgkEmployee['total']);

        // Aylık gelir vergisi
        $incomeTax = $this->calculateMonthlyIncomeTax($incomeTaxMatrah);

        // Damga vergisi
        $stampTax = $this->calculateStampTax($grossSalary);

        return [
            'gross_salary' => $grossSalary,
            'sgk_employee' => $sgkEmployee,
            'income_tax_matrah' => $incomeTaxMatrah,
            'income_tax' => $incomeTax,
            'stamp_tax' => $stampTax,
            'total_deductions' => round($sgkEmployee['total'] + $incomeTax + $stampTax, 2),
            'net_salary' => round($grossSalary - $sgkEmployee['total'] - $incomeTax - $stampTax, 2),
        ];
    }

    /**
     * Bordro dönemi için tüm çalışanların maaşlarını hesaplar.
     */
    public function calculatePeriodPayroll(PayrollPeriod $period): array
    {
        $employees = $period->employeesInPeriod()->get();
        $results = [];

        foreach ($employees as $employee) {
            $calculations = $this->calculateAllDeductions($employee, $period->start_date);

            $results[] = [
                'employee_id' => $employee->id,
                'employee' => $employee,
                'calculations' => $calculations,
            ];
        }

        return $results;
    }

    /**
     * Bordro kalemlerini vergi hesaplamalarıyla günceller.
     */
    public function updatePayrollItemsWithCalculations(PayrollPeriod $period): void
    {
        $employees = $period->employeesInPeriod()->get();

        foreach ($employees as $employee) {
            $calculations = $this->calculateAllDeductions($employee, $period->start_date);

            // Çalışanın mevcut kalemlerini güncelle
            $items = $period->payrollItems()->where('employee_id', $employee->id)->get();

            foreach ($items as $item) {
                $component = $item->salaryComponent;

                if ($component->type === 'earning' && $component->is_taxable) {
                    // Kazanç kalemi - vergi sonrası tutar
                    $taxRatio = $calculations['income_tax'] / max($calculations['gross_salary'], 1);
                    $calculatedAmount = $item->amount * (1 - $taxRatio);
                    $item->update(['calculated_amount' => round($calculatedAmount, 2)]);
                } elseif ($component->type === 'deduction') {
                    // Kesinti kalemi
                    $item->update(['calculated_amount' => $item->amount]);
                }
            }
        }
    }

    /**
     * İşveren maliyetini hesaplar.
     */
    public function calculateEmployerCost(float $grossSalary): array
    {
        $sgkEmployer = $this->calculateSgkEmployerShare($grossSalary);

        return [
            'gross_salary' => $grossSalary,
            'sgk_employer' => $sgkEmployer,
            'total_cost' => round($grossSalary + $sgkEmployer['total'], 2),
        ];
    }

    /**
     * Asgari ücretin vergi kesintilerini hesaplar.
     */
    public function calculateMinimumWageDeductions(): array
    {
        $employee = new Employee(['hire_date' => now()->toDateString()]);

        return $this->calculateAllDeductions($employee);
    }
}
