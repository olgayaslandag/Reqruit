<?php

namespace Database\Seeders;

use App\Models\BonusPayment;
use App\Models\Employee;
use App\Models\EmployeeSalary;
use App\Models\PayrollItem;
use App\Models\PayrollPeriod;
use App\Models\SalaryComponent;
use Illuminate\Database\Seeder;

class PayrollSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Payroll seeding başlıyor...');

        // Salary Components - Maaş Kalemleri
        $components = $this->createSalaryComponents();

        // Payroll Periods - Bordro Dönemleri
        $periods = $this->createPayrollPeriods();

        // Employees - Çalışanlar (mevcut veya oluştur)
        $employees = $this->getOrCreateEmployees();

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
            $created[$component['code']] = SalaryComponent::updateOrCreate(
                ['code' => $component['code']],
                $component
            );
        }

        return $created;
    }

    /**
     * Bordro dönemlerini oluşturur.
     */
    private function createPayrollPeriods(): array
    {
        $periods = [];
        $currentYear = date('Y');
        $currentMonth = (int) date('n');

        // Geçmiş 3 ay ve mevcut ay için dönem oluştur
        for ($i = 2; $i >= 0; $i--) {
            $month = $currentMonth - $i;
            $year = $currentYear;

            if ($month <= 0) {
                $month += 12;
                $year -= 1;
            }

            $startDate = sprintf('%d-%02d-01', $year, $month);
            $endDate = date('Y-m-t', strtotime($startDate));
            $paymentDate = sprintf('%d-%02d-15', $year, $month + 1);

            if ($month + 1 > 12) {
                $paymentDate = sprintf('%d-01-15', $year + 1);
            }

            $status = ($i === 0) ? 'published' : 'published';

            $periods[$month] = PayrollPeriod::updateOrCreate(
                [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ],
                [
                    'name' => sprintf('%02d/%d Dönemi', $month, $year),
                    'payment_frequency' => 'monthly',
                    'payment_date' => $paymentDate,
                    'status' => $status,
                ]
            );
        }

        return $periods;
    }

    /**
     * Çalışanları alır veya oluşturur.
     */
    private function getOrCreateEmployees(): array
    {
        // Mevcut çalışanları al veya 5 tane oluştur
        $employees = Employee::limit(5)->get();

        if ($employees->count() < 5) {
            $employees = Employee::factory()->count(5)->create();
        }

        return $employees->all();
    }

    /**
     * Çalışan maaş yapılandırmalarını oluşturur.
     */
    private function createEmployeeSalaries(array $employees, array $components): void
    {
        foreach ($employees as $employee) {
            // Temel maaş
            EmployeeSalary::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'salary_component_id' => $components['BASIC_SALARY']->id,
                    'start_date' => $employee->hire_date,
                ],
                [
                    'amount' => fake()->randomFloat(2, 20000, 50000),
                    'end_date' => null,
                    'payment_frequency' => 'monthly',
                ]
            );

            // Yemek ücreti
            EmployeeSalary::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'salary_component_id' => $components['MEAL_ALLOWANCE']->id,
                    'start_date' => $employee->hire_date,
                ],
                [
                    'amount' => 1500.00,
                    'end_date' => null,
                    'payment_frequency' => 'monthly',
                ]
            );

            // Ulaşım ücreti
            EmployeeSalary::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'salary_component_id' => $components['TRANSPORT_ALLOWANCE']->id,
                    'start_date' => $employee->hire_date,
                ],
                [
                    'amount' => 1000.00,
                    'end_date' => null,
                    'payment_frequency' => 'monthly',
                ]
            );
        }
    }

    /**
     * Bordro kalemlerini oluşturur.
     */
    private function createPayrollItems(array $periods, array $employees, array $components): void
    {
        foreach ($periods as $period) {
            foreach ($employees as $employee) {
                // Kazanç kalemleri
                PayrollItem::updateOrCreate(
                    [
                        'payroll_period_id' => $period->id,
                        'employee_id' => $employee->id,
                        'salary_component_id' => $components['BASIC_SALARY']->id,
                    ],
                    [
                        'amount' => fake()->randomFloat(2, 20000, 50000),
                        'calculated_amount' => fake()->randomFloat(2, 20000, 50000),
                        'quantity' => 1,
                    ]
                );

                PayrollItem::updateOrCreate(
                    [
                        'payroll_period_id' => $period->id,
                        'employee_id' => $employee->id,
                        'salary_component_id' => $components['MEAL_ALLOWANCE']->id,
                    ],
                    [
                        'amount' => 1500.00,
                        'calculated_amount' => 1500.00,
                        'quantity' => 1,
                    ]
                );

                PayrollItem::updateOrCreate(
                    [
                        'payroll_period_id' => $period->id,
                        'employee_id' => $employee->id,
                        'salary_component_id' => $components['TRANSPORT_ALLOWANCE']->id,
                    ],
                    [
                        'amount' => 1000.00,
                        'calculated_amount' => 1000.00,
                        'quantity' => 1,
                    ]
                );
            }
        }
    }

    /**
     * Prim ödemelerini oluşturur.
     */
    private function createBonusPayments(array $employees, array $periods): void
    {
        foreach ($employees as $employee) {
            // Yıllık ikramiye
            BonusPayment::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'bonus_type' => 'annual',
                    'payment_date' => date('Y-12-20'),
                ],
                [
                    'payroll_period_id' => null,
                    'amount' => fake()->randomFloat(2, 5000, 20000),
                    'tax_amount' => 0,
                    'net_amount' => fake()->randomFloat(2, 5000, 20000),
                    'description' => 'Yıllık ikramiye ödemesi',
                ]
            );

            // Performans primi (dönemli)
            if (count($periods) > 0) {
                $firstPeriod = reset($periods);
                BonusPayment::updateOrCreate(
                    [
                        'employee_id' => $employee->id,
                        'payroll_period_id' => $firstPeriod->id,
                        'bonus_type' => 'performance',
                    ],
                    [
                        'amount' => fake()->randomFloat(2, 2000, 10000),
                        'tax_amount' => fake()->randomFloat(2, 300, 1500),
                        'net_amount' => fake()->randomFloat(2, 1500, 8500),
                        'payment_date' => $firstPeriod->payment_date,
                        'description' => 'Performans primi',
                    ]
                );
            }
        }
    }
}
