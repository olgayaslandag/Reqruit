<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\LeaveType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeaveEntitlementsSeeder extends Seeder
{
    public function run(): void
    {
        // Make sure employees and leave types exist
        $employees = Employee::all();
        $leaveTypes = LeaveType::all();

        if ($employees->isEmpty() || $leaveTypes->isEmpty()) {
            $this->command->warn('Skipping leave entitlements seeding - Employees or leave types not found');

            return;
        }

        // Create leave entitlements for all employees based on leave types
        $entitlements = [];
        $now = now();

        foreach ($employees as $employee) {
            foreach ($leaveTypes as $leaveType) {
                // Create entitlement data for different years
                $currentYear = date('Y');

                for ($year = $currentYear - 1; $year <= $currentYear; $year++) {
                    $startDate = "$year-01-01";
                    $accrualDate = "$year-01-01";

                    // Different entitled days based on leave type
                    $entitledDays = match ($leaveType->code) {
                        'YILLIK' => rand(15, 26),
                        'HASTALIK' => 180,
                        'MAZERET' => 14,
                        'ANALIK' => 160,
                        'BABALIK' => 5,
                        default => rand(5, 30)
                    };

                    // Calculate used days (some percentage of entitled days)
                    $usedDays = 0;
                    if ($year == $currentYear && rand(1, 10) <= 3) { // 30% chance to have used some days
                        $usedDays = min($entitledDays, rand(0, (int) floor($entitledDays * 0.5)));
                    } elseif ($year < $currentYear && rand(1, 10) <= 7) { // 70% chance to have used some days in previous year
                        $usedDays = min($entitledDays, rand(0, (int) floor($entitledDays * 0.8)));
                    }

                    $entitlements[] = [
                        'employee_id' => $employee->id,
                        'leave_type_id' => $leaveType->id,
                        'entitled_days' => $entitledDays,
                        'used_days' => $usedDays,
                        'calculation_year_start' => $startDate,
                        'accrual_date' => $accrualDate,
                        'can_carry_over' => $leaveType->code === 'YILLIK', // Yearly leave can be carried over
                        'max_carry_over_days' => $leaveType->code === 'YILLIK' ? 182 : 0, // Half a year max carry over
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }
        }

        // Insert in chunks to avoid memory limit
        $chunks = array_chunk($entitlements, 100);

        foreach ($chunks as $chunk) {
            DB::table('leave_entitlements')->insert($chunk);
        }

        $this->command->info(count($entitlements).' leave entitlements created.');
    }
}
