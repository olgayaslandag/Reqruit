<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PayrollSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Payroll seeding başlıyor...');

        // Salary Components - Maaş Kalemleri
        $components = $this->createSalaryComponents();

        // Payroll Periods - Bordro Dönemleri (12 months)
        $periods = $this->createPayrollPeriods();

        // Employees - Çalışanlar (limit to avoid memory issues)
        $employees = DB::table('employees')->limit(200)->get()->map(fn ($e) => (array) $e)->toArray();

        if (empty($employees)) {
            $this->command->warn('No employees found. Run EmployeeSeeder first.');

            return;
        }

        $this->command->info('Processing '.count($employees).' employees');

        // Employee Salaries - Çalışan Maaş Yapılandırmaları
        $this->createEmployeeSalaries($employees, $components);

        // Payroll Items - Bordro Kalemleri
        $this->createPayrollItems($periods, $employees, $components);

        // Bonus Payments - Prim Ödemeleri
        $this->createBonusPayments($employees, $periods);

        $this->command->info('Payroll seeding tamamlandı!');
    }

    /**
     * Maaş kalemlerini oluşturur.
     */
    private function createSalaryComponents(): array
    {
        $components = [
            // Kazançlar - Earnings
            [
                'name' => 'Temel Maaş',
                'code' => 'BASIC_SALARY',
                'type' => 'earning',
                'category' => 'fixed',
                'is_active' => true,
                'is_taxable' => true,
                'is_sgk_applicable' => true,
                'default_amount' => 25000.00,
                'sort_order' => 1,
            ],
            [
                'name' => 'Yemek Ücreti',
                'code' => 'MEAL_ALLOWANCE',
                'type' => 'earning',
                'category' => 'fixed',
                'is_active' => true,
                'is_taxable' => false,
                'is_sgk_applicable' => false,
                'default_amount' => 1500.00,
                'sort_order' => 2,
            ],
            [
                'name' => 'Ulaşım Ücreti',
                'code' => 'TRANSPORT_ALLOWANCE',
                'type' => 'earning',
                'category' => 'fixed',
                'is_active' => true,
                'is_taxable' => true,
                'is_sgk_applicable' => true,
                'default_amount' => 1000.00,
                'sort_order' => 3,
            ],
            [
                'name' => 'Fazla Mesai',
                'code' => 'OVERTIME',
                'type' => 'earning',
                'category' => 'variable',
                'is_active' => true,
                'is_taxable' => true,
                'is_sgk_applicable' => true,
                'default_amount' => null,
                'sort_order' => 4,
            ],
            [
                'name' => 'Performans Primi',
                'code' => 'PERFORMANCE_BONUS',
                'type' => 'earning',
                'category' => 'variable',
                'is_active' => true,
                'is_taxable' => true,
                'is_sgk_applicable' => true,
                'default_amount' => null,
                'sort_order' => 5,
            ],
            [
                'name' => 'Asgari Geçim İndirimi (AGİ)',
                'code' => 'AGI',
                'type' => 'earning',
                'category' => 'fixed',
                'is_active' => true,
                'is_taxable' => false,
                'is_sgk_applicable' => false,
                'default_amount' => 268.31,
                'sort_order' => 6,
            ],
            [
                'name' => 'Sosyal Yardım',
                'code' => 'SOCIAL_AID',
                'type' => 'earning',
                'category' => 'fixed',
                'is_active' => true,
                'is_taxable' => false,
                'is_sgk_applicable' => false,
                'default_amount' => 500.00,
                'sort_order' => 7,
            ],

            // Kesintiler - Deductions
            [
                'name' => 'Gelir Vergisi',
                'code' => 'INCOME_TAX',
                'type' => 'deduction',
                'category' => 'variable',
                'is_active' => true,
                'is_taxable' => false,
                'is_sgk_applicable' => false,
                'default_amount' => null,
                'sort_order' => 101,
            ],
            [
                'name' => 'SGK İşçi Payı',
                'code' => 'SGK_EMPLOYEE',
                'type' => 'deduction',
                'category' => 'variable',
                'is_active' => true,
                'is_taxable' => false,
                'is_sgk_applicable' => false,
                'default_amount' => null,
                'sort_order' => 102,
            ],
            [
                'name' => 'İşsizlik Sigortası',
                'code' => 'UNEMPLOYMENT_INSURANCE',
                'type' => 'deduction',
                'category' => 'variable',
                'is_active' => true,
                'is_taxable' => false,
                'is_sgk_applicable' => false,
                'default_amount' => null,
                'sort_order' => 103,
            ],
            [
                'name' => 'Avans Kesintisi',
                'code' => 'ADVANCE_DEDUCTION',
                'type' => 'deduction',
                'category' => 'variable',
                'is_active' => true,
                'is_taxable' => false,
                'is_sgk_applicable' => false,
                'default_amount' => null,
                'sort_order' => 104,
            ],
        ];

        $created = [];
        foreach ($components as $component) {
            // Check if exists
            $existing = DB::table('salary_components')->where('code', $component['code'])->first();
            if ($existing) {
                DB::table('salary_components')->where('id', $existing->id)->update($component);
                $created[$component['code']] = (object) ['id' => $existing->id];
            } else {
                $id = DB::table('salary_components')->insertGetId($component);
                $created[$component['code']] = (object) ['id' => $id];
            }
        }

        return $created;
    }

    /**
     * Bordro dönemlerini oluşturur - 24 months (2025 + 2026)
     */
    private function createPayrollPeriods(): array
    {
        $periods = [];

        // 2025: January to December (12 months)
        $year2025 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        // 2026: January to March (3 months)
        $year2026 = [1, 2, 3];

        $allMonths = [];
        foreach ($year2025 as $month) {
            $allMonths[] = ['month' => $month, 'year' => 2025];
        }
        foreach ($year2026 as $month) {
            $allMonths[] = ['month' => $month, 'year' => 2026];
        }

        foreach ($allMonths as $data) {
            $month = $data['month'];
            $year = $data['year'];

            $startDate = sprintf('%d-%02d-01', $year, $month);
            $endDate = date('Y-m-t', strtotime($startDate));
            $paymentDate = sprintf('%d-%02d-15', $year, $month + 1);

            if ($month + 1 > 12) {
                $paymentDate = sprintf('%d-01-15', $year + 1);
            }

            // Status: published for past months, draft for future
            $isPast = strtotime($endDate) < time();
            $status = $isPast ? 'published' : 'draft';

            // Check if period exists
            $existing = DB::table('payroll_periods')
                ->where('start_date', $startDate)
                ->where('end_date', $endDate)
                ->first();

            if ($existing) {
                DB::table('payroll_periods')->where('id', $existing->id)->update([
                    'name' => sprintf('%02d/%d Dönemi', $month, $year),
                    'payment_frequency' => 'monthly',
                    'payment_date' => $paymentDate,
                    'status' => $status,
                ]);
                $periods[] = (object) ['id' => $existing->id, 'payment_date' => $paymentDate];
            } else {
                $id = DB::table('payroll_periods')->insertGetId([
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'name' => sprintf('%02d/%d Dönemi', $month, $year),
                    'payment_frequency' => 'monthly',
                    'payment_date' => $paymentDate,
                    'status' => $status,
                ]);
                $periods[] = (object) ['id' => $id, 'payment_date' => $paymentDate];
            }
        }

        $this->command->info('Created '.count($periods).' payroll periods (2025-2026)');

        return $periods;
    }

    /**
     * Çalışan maaş yapılandırmalarını oluşturur.
     */
    private function createEmployeeSalaries(array $employees, array $components): void
    {
        $salaryData = [];

        foreach ($employees as $employee) {
            $baseSalary = rand(20000, 55000);
            $hireDate = $employee['hire_date'];

            // Temel maaş
            $salaryData[] = [
                'employee_id' => $employee['id'],
                'salary_component_id' => $components['BASIC_SALARY']->id,
                'start_date' => $hireDate,
                'amount' => $baseSalary,
                'end_date' => null,
                'payment_frequency' => 'monthly',
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Yemek ücreti
            $salaryData[] = [
                'employee_id' => $employee['id'],
                'salary_component_id' => $components['MEAL_ALLOWANCE']->id,
                'start_date' => $hireDate,
                'amount' => 1500.00,
                'end_date' => null,
                'payment_frequency' => 'monthly',
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Ulaşım ücreti
            $salaryData[] = [
                'employee_id' => $employee['id'],
                'salary_component_id' => $components['TRANSPORT_ALLOWANCE']->id,
                'start_date' => $hireDate,
                'amount' => 1000.00,
                'end_date' => null,
                'payment_frequency' => 'monthly',
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // AGI - Asgari Geçim İndirimi
            $salaryData[] = [
                'employee_id' => $employee['id'],
                'salary_component_id' => $components['AGI']->id,
                'start_date' => $hireDate,
                'amount' => 268.31,
                'end_date' => null,
                'payment_frequency' => 'monthly',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        foreach (array_chunk($salaryData, 50) as $chunk) {
            DB::table('employee_salaries')->insert($chunk);
        }

        $this->command->info('Created '.count($salaryData).' employee salaries');
    }

    /**
     * Bordro kalemlerini oluşturur.
     */
    private function createPayrollItems(array $periods, array $employees, array $components): void
    {
        $payrollItemsData = [];

        foreach ($periods as $period) {
            foreach ($employees as $employee) {
                $baseSalary = rand(20000, 55000);

                // Basic Salary
                $payrollItemsData[] = [
                    'payroll_period_id' => $period->id,
                    'employee_id' => $employee['id'],
                    'salary_component_id' => $components['BASIC_SALARY']->id,
                    'amount' => $baseSalary,
                    'calculated_amount' => $baseSalary,
                    'quantity' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                // Meal Allowance
                $payrollItemsData[] = [
                    'payroll_period_id' => $period->id,
                    'employee_id' => $employee['id'],
                    'salary_component_id' => $components['MEAL_ALLOWANCE']->id,
                    'amount' => 1500.00,
                    'calculated_amount' => 1500.00,
                    'quantity' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                // Transport Allowance
                $payrollItemsData[] = [
                    'payroll_period_id' => $period->id,
                    'employee_id' => $employee['id'],
                    'salary_component_id' => $components['TRANSPORT_ALLOWANCE']->id,
                    'amount' => 1000.00,
                    'calculated_amount' => 1000.00,
                    'quantity' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                // AGI
                $payrollItemsData[] = [
                    'payroll_period_id' => $period->id,
                    'employee_id' => $employee['id'],
                    'salary_component_id' => $components['AGI']->id,
                    'amount' => 268.31,
                    'calculated_amount' => 268.31,
                    'quantity' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                // Overtime (only for some employees)
                if (rand(0, 1)) {
                    $overtimeHours = rand(5, 30);
                    $overtimeRate = 50; // per hour
                    $overtimeAmount = $overtimeHours * $overtimeRate;

                    $payrollItemsData[] = [
                        'payroll_period_id' => $period->id,
                        'employee_id' => $employee['id'],
                        'salary_component_id' => $components['OVERTIME']->id,
                        'amount' => $overtimeAmount,
                        'calculated_amount' => $overtimeAmount,
                        'quantity' => $overtimeHours,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                // Deductions (calculated)
                $sgkEmployee = $baseSalary * 0.14; // SGK employee share
                $unemployment = $baseSalary * 0.02; // Unemployment insurance
                $incomeTax = ($baseSalary - $sgkEmployee - $unemployment) * 0.15; // Simplified income tax

                $payrollItemsData[] = [
                    'payroll_period_id' => $period->id,
                    'employee_id' => $employee['id'],
                    'salary_component_id' => $components['SGK_EMPLOYEE']->id,
                    'amount' => $sgkEmployee,
                    'calculated_amount' => $sgkEmployee,
                    'quantity' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $payrollItemsData[] = [
                    'payroll_period_id' => $period->id,
                    'employee_id' => $employee['id'],
                    'salary_component_id' => $components['UNEMPLOYMENT_INSURANCE']->id,
                    'amount' => $unemployment,
                    'calculated_amount' => $unemployment,
                    'quantity' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $payrollItemsData[] = [
                    'payroll_period_id' => $period->id,
                    'employee_id' => $employee['id'],
                    'salary_component_id' => $components['INCOME_TAX']->id,
                    'amount' => $incomeTax,
                    'calculated_amount' => $incomeTax,
                    'quantity' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        foreach (array_chunk($payrollItemsData, 100) as $chunk) {
            DB::table('payroll_items')->insert($chunk);
        }

        $this->command->info('Created '.count($payrollItemsData).' payroll items');
    }

    /**
     * Prim ödemelerini oluşturur.
     */
    private function createBonusPayments(array $employees, array $periods): void
    {
        $bonusData = [];

        // Annual bonus for all employees (December 2025)
        $annualBonusPeriod = end($periods);

        foreach ($employees as $employee) {
            $bonusAmount = rand(5000, 25000);
            $taxAmount = $bonusAmount * 0.15;

            $bonusData[] = [
                'employee_id' => $employee['id'],
                'payroll_period_id' => null,
                'bonus_type' => 'annual',
                'amount' => $bonusAmount,
                'tax_amount' => $taxAmount,
                'net_amount' => $bonusAmount - $taxAmount,
                'payment_date' => '2025-12-20',
                'description' => 'Yıllık ikramiye ödemesi',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Performance bonus for some employees (random periods)
        $performancePeriods = array_slice($periods, 0, 6); // First 6 months

        foreach ($employees as $employee) {
            if (rand(0, 1)) { // 50% chance
                $period = $performancePeriods[array_rand($performancePeriods)];
                $bonusAmount = rand(2000, 12000);
                $taxAmount = $bonusAmount * 0.15;

                $bonusData[] = [
                    'employee_id' => $employee['id'],
                    'payroll_period_id' => $period->id,
                    'bonus_type' => 'performance',
                    'amount' => $bonusAmount,
                    'tax_amount' => $taxAmount,
                    'net_amount' => $bonusAmount - $taxAmount,
                    'payment_date' => $period->payment_date,
                    'description' => 'Performans primi',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        foreach (array_chunk($bonusData, 50) as $chunk) {
            DB::table('bonus_payments')->insert($chunk);
        }

        $this->command->info('Created '.count($bonusData).' bonus payments');
    }
}
