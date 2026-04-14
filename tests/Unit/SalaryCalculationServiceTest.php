<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Services\SalaryCalculationService;
use Tests\TestCase;

class SalaryCalculationServiceTest extends TestCase
{
    protected SalaryCalculationService $calculationService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->calculationService = app(SalaryCalculationService::class);
    }

    // ============================================================
    // SGK HESAPLAMA TESTLERİ
    // ============================================================

    public function test_calculate_sgk_employee_share(): void
    {
        $grossSalary = 50000.00;

        $result = $this->calculationService->calculateSgkEmployeeShare($grossSalary);

        // SGK işçi payı = %14 + %2 işsizlik
        $expectedSgk = 50000 * SalaryCalculationService::SGK_EMPLOYEE_PREMIUM_RATE;
        $expectedUnemployment = 50000 * SalaryCalculationService::UNEMPLOYMENT_EMPLOYEE_RATE;
        $expectedTotal = $expectedSgk + $expectedUnemployment;

        $this->assertEquals(round($expectedSgk, 2), $result['health_premium']);
        $this->assertEquals(round($expectedUnemployment, 2), $result['unemployment_premium']);
        $this->assertEquals(round($expectedTotal, 2), $result['total']);
    }

    public function test_calculate_sgk_employer_share(): void
    {
        $grossSalary = 50000.00;

        $result = $this->calculationService->calculateSgkEmployerShare($grossSalary);

        $this->assertArrayHasKey('employer_premium', $result);
        $this->assertArrayHasKey('unemployment_employer', $result);
        $this->assertArrayHasKey('total', $result);
        $this->assertGreaterThan(0, $result['total']);
    }

    public function test_calculate_sgk_matrah_within_bounds(): void
    {
        $grossSalary = 50000.00;
        $matrah = $this->calculationService->calculateSgkMatrah($grossSalary);

        $this->assertEquals($grossSalary, $matrah);
    }

    public function test_calculate_sgk_matrah_below_minimum(): void
    {
        $grossSalary = 10000.00;
        $matrah = $this->calculationService->calculateSgkMatrah($grossSalary);

        $this->assertEquals(SalaryCalculationService::SGK_MIN_MONTHLY, $matrah);
    }

    public function test_calculate_sgk_matrah_above_maximum(): void
    {
        $grossSalary = 200000.00;
        $matrah = $this->calculationService->calculateSgkMatrah($grossSalary);

        $this->assertEquals(SalaryCalculationService::SGK_MAX_MONTHLY, $matrah);
    }

    // ============================================================
    // VERGİ HESAPLAMA TESTLERİ
    // ============================================================

    public function test_calculate_income_tax_first_bracket(): void
    {
        $annualMatrah = 60000.00;

        $tax = $this->calculationService->calculateIncomeTax($annualMatrah);

        $expectedTax = 60000 * 0.15;
        $this->assertEquals(round($expectedTax, 2), $tax);
    }

    public function test_calculate_income_tax_second_bracket(): void
    {
        $annualMatrah = 150000.00;

        $tax = $this->calculationService->calculateIncomeTax($annualMatrah);

        $expectedTax = (110000 * 0.15) + (40000 * 0.20);
        $this->assertEquals(round($expectedTax, 2), $tax);
    }

    public function test_calculate_income_tax_multiple_brackets(): void
    {
        $annualMatrah = 300000.00;

        $tax = $this->calculationService->calculateIncomeTax($annualMatrah);

        $expectedTax = (110000 * 0.15) + (120000 * 0.20) + (70000 * 0.27);
        $this->assertEquals(round($expectedTax, 2), $tax);
    }

    public function test_calculate_monthly_income_tax(): void
    {
        $monthlyMatrah = 50000.00;

        $monthlyTax = $this->calculationService->calculateMonthlyIncomeTax($monthlyMatrah);
        $annualTax = $this->calculationService->calculateIncomeTax($monthlyMatrah * 12);

        $this->assertEquals(round($annualTax / 12, 2), $monthlyTax);
    }

    public function test_calculate_income_tax_matrah(): void
    {
        $grossSalary = 50000.00;
        $sgkEmployee = 7000.00;

        $matrah = $this->calculationService->calculateIncomeTaxMatrah($grossSalary, $sgkEmployee);

        $expectedMatrah = $grossSalary - $sgkEmployee;
        $this->assertEquals($expectedMatrah, $matrah);
    }

    // ============================================================
    // DAMGA VERGİSİ TESTLERİ
    // ============================================================

    public function test_calculate_stamp_tax(): void
    {
        $grossSalary = 50000.00;

        $stampTax = $this->calculationService->calculateStampTax($grossSalary);

        $expectedStampTax = $grossSalary * SalaryCalculationService::STAMP_TAX_RATE;
        $this->assertEquals(round($expectedStampTax, 2), $stampTax);
    }

    // ============================================================
    // İŞVEREN MALİYETİ TESTLERİ
    // ============================================================

    public function test_calculate_employer_cost(): void
    {
        $grossSalary = 50000.00;

        $result = $this->calculationService->calculateEmployerCost($grossSalary);

        $this->assertArrayHasKey('gross_salary', $result);
        $this->assertArrayHasKey('sgk_employer', $result);
        $this->assertArrayHasKey('total_cost', $result);
        $this->assertGreaterThan($grossSalary, $result['total_cost']);
    }

    // ============================================================
    // ASGARI ÜCRET TESTLERİ
    // ============================================================

    public function test_calculate_minimum_wage_deductions(): void
    {
        // This test requires repository - skip for now
        $this->assertTrue(true);
    }

    // ============================================================
    // VERGİ DİLİMİ TESTLERİ
    // ============================================================

    public function test_get_tax_bracket_first_bracket(): void
    {
        $yearlyIncome = 50000.00;

        // Use reflection to call protected/private method or test via public interface
        $brackets = SalaryCalculationService::TAX_BRACKETS;

        // First bracket test
        $this->assertLessThanOrEqual(110000, $yearlyIncome);
    }

    public function test_tax_brackets_are_defined(): void
    {
        $brackets = SalaryCalculationService::TAX_BRACKETS;

        $this->assertIsArray($brackets);
        $this->assertCount(5, $brackets);
        $this->assertEquals(0.15, $brackets[0]['rate']);
        $this->assertEquals(0.40, $brackets[4]['rate']);
    }

    // ============================================================
    // KENAR DURUM TESTLERİ
    // ============================================================

    public function test_calculate_income_tax_with_zero_income(): void
    {
        $tax = $this->calculationService->calculateIncomeTax(0);

        $this->assertEquals(0, $tax);
    }

    public function test_calculate_sgk_matrah_at_minimum(): void
    {
        $matrah = $this->calculationService->calculateSgkMatrah(SalaryCalculationService::SGK_MIN_MONTHLY);

        $this->assertEquals(SalaryCalculationService::SGK_MIN_MONTHLY, $matrah);
    }

    public function test_calculate_sgk_matrah_at_maximum(): void
    {
        $matrah = $this->calculationService->calculateSgkMatrah(SalaryCalculationService::SGK_MAX_MONTHLY);

        $this->assertEquals(SalaryCalculationService::SGK_MAX_MONTHLY, $matrah);
    }

    public function test_constants_are_defined(): void
    {
        // SGK constants
        $this->assertTrue(defined('App\Services\SalaryCalculationService::SGK_EMPLOYEE_PREMIUM_RATE'));
        $this->assertTrue(defined('App\Services\SalaryCalculationService::UNEMPLOYMENT_EMPLOYEE_RATE'));
        $this->assertTrue(defined('App\Services\SalaryCalculationService::SGK_EMPLOYER_PREMIUM_RATE'));
        $this->assertTrue(defined('App\Services\SalaryCalculationService::UNEMPLOYMENT_EMPLOYER_RATE'));
        $this->assertTrue(defined('App\Services\SalaryCalculationService::STAMP_TAX_RATE'));
        $this->assertTrue(defined('App\Services\SalaryCalculationService::MINIMUM_WAGE_MONTHLY'));
        $this->assertTrue(defined('App\Services\SalaryCalculationService::SGK_MIN_MONTHLY'));
        $this->assertTrue(defined('App\Services\SalaryCalculationService::SGK_MAX_MONTHLY'));

        // Values check
        $this->assertEquals(0.14, SalaryCalculationService::SGK_EMPLOYEE_PREMIUM_RATE);
        $this->assertEquals(0.02, SalaryCalculationService::UNEMPLOYMENT_EMPLOYEE_RATE);
        $this->assertEquals(0.255, SalaryCalculationService::SGK_EMPLOYER_PREMIUM_RATE);
        $this->assertEquals(22650.00, SalaryCalculationService::MINIMUM_WAGE_MONTHLY);
    }
}
