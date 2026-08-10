<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\PayrollStatusEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RecentPayrollPeriodsSeeder extends Seeder
{
    public function run(): void
    {
        $employeeCount = DB::table('employees')->count();

        if ($employeeCount === 0) {
            $this->command->warn('No employees found.');

            return;
        }

        $components = DB::table('salary_components')->get()->keyBy('code');

        $required = ['BASIC_SALARY', 'MEAL_ALLOWANCE', 'TRANSPORT_ALLOWANCE', 'AGI', 'SGK_EMPLOYEE', 'UNEMPLOYMENT_INSURANCE', 'INCOME_TAX'];
        if (! $components->has($required)) {
            $this->command->warn('Salary components missing. Run PayrollSeeder first.');

            return;
        }

        $createdAny = false;

        // Son 3 ayı kapsa (i >= 2: bu ay ve önceki 2 ay)
        for ($i = 2; $i >= 0; $i--) {
            $month = now()->copy()->subMonths($i);

            $startDate = $month->copy()->startOfMonth()->toDateString();
            $endDate = $month->copy()->endOfMonth()->toDateString();
            $paymentDate = $month->copy()->addMonth()->startOfMonth()->addDays(14)->toDateString();
            $name = sprintf('%02d/%d Dönemi', $month->month, $month->year);

            $period = DB::table('payroll_periods')
                ->where('start_date', $startDate)
                ->where('end_date', $endDate)
                ->where('payment_frequency', 'monthly')
                ->first();

            if (! $period) {
                $status = $month->isFuture() ? PayrollStatusEnum::DRAFT->value : PayrollStatusEnum::PUBLISHED->value;

                $periodId = DB::table('payroll_periods')->insertGetId([
                    'name' => $name,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'payment_frequency' => 'monthly',
                    'payment_date' => $paymentDate,
                    'status' => $status,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $period = (object) ['id' => $periodId, 'status' => $status];
                $createdAny = true;
            }

            // Bu period için payroll item var mı?
            $itemCount = DB::table('payroll_items')->where('payroll_period_id', $period->id)->count();

            if ($itemCount > 0) {
                $this->command->info("Period {$name} already has {$itemCount} items. Skipping.");

                continue;
            }

            // Diğer yedek bekleyen period'ları manager_approved'da tutma - sadece item üret
            $this->createItems($period->id, $components);
        }

        $this->command->info($createdAny ? 'Recent payroll periods created.' : 'No new recent payroll periods created.');
    }

    private function createItems(int $periodId, $components): void
    {
        $employeeIds = DB::table('employees')->pluck('id')->toArray();

        $items = [];

        foreach ($employeeIds as $employeeId) {
            $baseSalary = rand(25000, 55000);

            $sgk = round($baseSalary * 0.14, 2);
            $unemployment = round($baseSalary * 0.02, 2);
            $incomeTax = round(($baseSalary - $sgk - $unemployment) * 0.15, 2);

            $rows = [
                ['salary_component_id' => $components['BASIC_SALARY']->id, 'amount' => $baseSalary, 'quantity' => 1],
                ['salary_component_id' => $components['MEAL_ALLOWANCE']->id, 'amount' => 1500.00, 'quantity' => 1],
                ['salary_component_id' => $components['TRANSPORT_ALLOWANCE']->id, 'amount' => 1000.00, 'quantity' => 1],
                ['salary_component_id' => $components['AGI']->id, 'amount' => 268.31, 'quantity' => 1],
                ['salary_component_id' => $components['SGK_EMPLOYEE']->id, 'amount' => $sgk, 'quantity' => 1],
                ['salary_component_id' => $components['UNEMPLOYMENT_INSURANCE']->id, 'amount' => $unemployment, 'quantity' => 1],
                ['salary_component_id' => $components['INCOME_TAX']->id, 'amount' => $incomeTax, 'quantity' => 1],
            ];

            foreach ($rows as $row) {
                $items[] = array_merge($row, [
                    'payroll_period_id' => $periodId,
                    'employee_id' => $employeeId,
                    'calculated_amount' => $row['amount'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        foreach (array_chunk($items, 200) as $chunk) {
            DB::table('payroll_items')->insert($chunk);
        }

        $this->command->info('Created '.count($items).' payroll items for period #'.$periodId);
    }
}