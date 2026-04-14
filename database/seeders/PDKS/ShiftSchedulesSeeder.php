<?php

declare(strict_types=1);

namespace Database\Seeders\PDKS;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Shift;
use App\Models\ShiftSchedule;
use App\Models\WorkCalendar;
use Illuminate\Database\Seeder;

class ShiftSchedulesSeeder extends Seeder
{
    public function run(): void
    {
        $employees = Employee::all();
        $shifts = Shift::all();
        $departments = Department::all();
        $calendar = WorkCalendar::where('is_active', true)->first();

        if ($employees->isEmpty() || $shifts->isEmpty()) {
            $this->command->warn('Employees or Shifts not found. Run EmployeeSeeder and ShiftsSeeder first.');

            return;
        }

        $startDate = now()->startOfMonth()->subMonth(); // Şubat 2026 başı
        $endDate = now()->addDays(15); // Mart ortası

        $schedules = [];
        $assignedBy = 1; // Admin user

        foreach (\Carbon\Carbon::createFromDate(2026, 2, 1)->toPeriod($endDate) as $date) {
            foreach ($employees as $employee) {
                $departmentId = $employee->department_id;

                $schedules[] = [
                    'shift_id' => $shifts->random()->id,
                    'work_calendar_id' => $calendar->id,
                    'employee_id' => $employee->id,
                    'department_id' => $departmentId,
                    'date' => $date->toDateString(),
                    'assigned_by' => $assignedBy,
                    'note' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        foreach (array_chunk($schedules, 500) as $chunk) {
            ShiftSchedule::insert($chunk);
        }

        $this->command->info(count($schedules).' shift schedules created with department_id.');
    }
}
