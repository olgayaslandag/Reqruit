<?php

declare(strict_types=1);

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
    // Helper methods to get tax calculation parameters from config
    private function getSgkEmployeePremiumRate(): float
    {
        return Config::get('salary.sgk.employee_premium_rate', 0.14);
    }

    private function getUnemploymentEmployeeRate(): float
    {
        return Config::get('salary.sgk.unemployment_employee_rate', 0.02);
    }

    private function getSgkEmployerPremiumRate(): float
    {
        return Config::get('salary.sgk.employer_premium_rate', 0.255);
    }

    private function getUnemploymentEmployerRate(): float
    {
        return Config::get('salary.sgk.unemployment_employer_rate', 0.03);
    }

    private function getStampTaxRate(): float
    {
        return Config::get('salary.stamp_tax_rate', 0.00659);
    }

    private function getTaxBrackets(): array
    {
        return Config::get('salary.income_tax_brackets', [
            ['min' => 0, 'max' => 110000, 'rate' => 0.15],
            ['min' => 110000, 'max' => 230000, 'rate' => 0.20],
            ['min' => 230000, 'max' => 580000, 'rate' => 0.27],
            ['min' => 580000, 'max' => 3000000, 'rate' => 0.35],
            ['min' => 3000000, 'max' => PHP_INT_MAX, 'rate' => 0.40],
        ]);
    }

    private function getMinimumWageMonthly(): float
    {
        return Config::get('salary.minimum_wage_monthly', 22650.00);
    }

    private function getSgkMinMonthly(): float
    {
        return Config::get('salary.sgk_limits.min_monthly', 22650.00);
    }

    private function getSgkMaxMonthly(): float
    {
        return Config::get('salary.sgk_limits.max_monthly', 170130.00);
    }

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

        if ($sgkMatrah < $this->getSgkMinMonthly()) {
            $sgkMatrah = $this->getSgkMinMonthly();
        } elseif ($sgkMatrah > $this->getSgkMaxMonthly()) {
            $sgkMatrah = $this->getSgkMaxMonthly();
        }

        return $sgkMatrah;
    }

    /**
     * SGK işçi payını hesaplar.
     */
    public function calculateSgkEmployeeShare(float $grossSalary): array
    {
        $sgkMatrah = $this->calculateSgkMatrah($grossSalary);

        $healthPremium = $sgkMatrah * $this->getSgkEmployeePremiumRate();
        $unemploymentPremium = $sgkMatrah * $this->getUnemploymentEmployeeRate();

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

        $employerPremium = $sgkMatrah * $this->getSgkEmployerPremiumRate();
        $unemploymentEmployer = $sgkMatrah * $this->getUnemploymentEmployerRate();

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

        foreach ($this->getTaxBrackets() as $bracket) {
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
        return round($grossSalary * $this->getStampTaxRate(), 2);
    }

    /**
     * Asgari ücretin vergi kesintilerini hesaplar.
     */
    public function calculateMinimumWageDeductions(): array
    {
        $grossSalary = $this->getMinimumWageMonthly();

        // Calculate based on mimicking how other methods work
        // Use minimum wage amount directly to determine typical deductions

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
}
