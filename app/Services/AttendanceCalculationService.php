<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\AttendanceRecord;
use App\Models\Shift;
use Carbon\Carbon;

class AttendanceCalculationService
{
    public function calculateWorkingHoursOnDay(int $employeeId, Carbon $date): array
    {
        $attendances = AttendanceRecord::forEmployee($employeeId)
            ->forDate($date)
            ->orderBy('time')
            ->get();

        $checkIn = null;
        $checkOut = null;
        $breakStart = null;
        $breakEnd = null;

        foreach ($attendances as $attendance) {
            switch ($attendance->type->value) {
                case 'check_in':
                    $checkIn = Carbon::createFromTime($attendance->time);
                    break;
                case 'check_out':
                    $checkOut = Carbon::createFromTime($attendance->time);
                    break;
                case 'break_start':
                    $breakStart = Carbon::createFromTime($attendance->time);
                    break;
                case 'break_end':
                    $breakEnd = Carbon::createFromTime($attendance->time);
                    break;
            }
        }

        $totalBreakMinutes = 0;
        if ($breakStart && $breakEnd) {
            $totalBreakMinutes = $breakEnd->diffInMinutes($breakStart);
        }

        $workingMinutes = 0;
        if ($checkIn && $checkOut) {
            $workingMinutes = max(0, $checkOut->diffInMinutes($checkIn) - $totalBreakMinutes);
        }

        return [
            'check_in' => $checkIn?->format('H:i:s'),
            'check_out' => $checkOut?->format('H:i:s'),
            'break_start' => $breakStart?->format('H:i:s'),
            'break_end' => $breakEnd?->format('H:i:s'),
            'break_minutes' => $totalBreakMinutes,
            'working_minutes' => $workingMinutes,
            'working_hours' => round($workingMinutes / 60, 2),
        ];
    }

    public function calculateOvertimeDuration(int $employeeId, Carbon $date, ?Shift $shift = null): float
    {
        $dayStats = $this->calculateWorkingHoursOnDay($employeeId, $date);
        $actualHours = $dayStats['working_hours'];

        if ($shift) {
            $expectedHours = $shift->getExpectedWorkingHoursAttribute();
            $overtimeHours = max(0, $actualHours - $expectedHours);
        } else {
            // If no shift is defined, we might assume the standard working hours
            $expectedHours = 8.0; // This is our fallback assumption
            $overtimeHours = max(0, $actualHours - $expectedHours);
        }

        return round($overtimeHours, 2);
    }

    public function calculateLateDuration(int $employeeId, Carbon $date, ?Shift $shift = null): float
    {
        $attendances = AttendanceRecord::forEmployee($employeeId)
            ->forDate($date)
            ->where('type', 'check_in')
            ->orderBy('time')
            ->first();

        if (! $attendances || ! $shift) {
            return 0.0;
        }

        $checkInTime = Carbon::createFromTime($attendances->time);
        $scheduledStartTime = Carbon::createFromTime($shift->start_time);

        if ($checkInTime->gt($scheduledStartTime)) {
            $toleranceMinutes = $shift->tolerance_minutes ?? 15;
            $effectiveStartTime = $scheduledStartTime->copy()->addMinutes($toleranceMinutes);

            if ($checkInTime->gt($effectiveStartTime)) {
                $lateMinutes = $checkInTime->diffInMinutes($effectiveStartTime);

                return round($lateMinutes / 60, 2);
            }
        }

        return 0.0;
    }

    public function calculateEarlyLeaveDuration(int $employeeId, Carbon $date, ?Shift $shift = null): float
    {
        $attendances = AttendanceRecord::forEmployee($employeeId)
            ->forDate($date)
            ->where('type', 'check_out')
            ->orderByDesc('time')
            ->first();

        if (! $attendances || ! $shift) {
            return 0.0;
        }

        $checkOutTime = Carbon::createFromTime($attendances->time);
        $scheduledEndTime = Carbon::createFromTime($shift->end_time);

        if ($checkOutTime->lt($scheduledEndTime)) {
            $toleranceMinutes = $shift->tolerance_minutes ?? 15;
            $effectiveEndTime = $scheduledEndTime->copy()->subMinutes($toleranceMinutes);

            if ($checkOutTime->lt($effectiveEndTime)) {
                $earlyMinutes = $effectiveEndTime->diffInMinutes($checkOutTime);

                return round($earlyMinutes / 60, 2);
            }
        }

        return 0.0;
    }

    public function getMonthlyAttendanceStatistics(int $employeeId, int $year, int $month): array
    {
        $startDate = Carbon::create($year, $month, 1)->startOfDay();
        $endDate = Carbon::create($year, $month, 1)->endOfMonth()->endOfDay();

        // Get all attendance records for the month
        $attendances = AttendanceRecord::forEmployee($employeeId)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        // Group them by date
        $dailyAttendances = $attendances->groupBy(function ($attendance) {
            return $attendance->date->format('Y-m-d');
        });

        $totalWorkDays = 0;
        $totalWorkHours = 0;
        $totalOvertimeHours = 0;
        $lateDays = 0;
        $lateHours = 0;
        $earlyLeaveDays = 0;
        $earlyLeaveHours = 0;

        foreach ($dailyAttendances as $date => $dailyAttendance) {
            $dateObj = Carbon::parse($date);

            // Get shift for this particular day
            $shiftSchedule = $this->getEmployeeShiftForDate($employeeId, $dateObj);
            $shift = $shiftSchedule ? $shiftSchedule->shift : null;

            // Calculate work hours for the day
            $dailyStats = $this->calculateWorkingHoursOnDay($employeeId, $dateObj);
            $actualHours = $dailyStats['working_hours'];
            $overtimeHours = $this->calculateOvertimeDuration($employeeId, $dateObj, $shift);
            $lateHoursToday = $this->calculateLateDuration($employeeId, $dateObj, $shift);
            $earlyLeaveHoursToday = $this->calculateEarlyLeaveDuration($employeeId, $dateObj, $shift);

            if ($actualHours > 0 || $shift) { // Count as a work day if there's scheduled shift or actual work
                $totalWorkDays++;
                $totalWorkHours += $actualHours;
                $totalOvertimeHours += $overtimeHours;

                if ($lateHoursToday > 0) {
                    $lateDays++;
                    $lateHours += $lateHoursToday;
                }

                if ($earlyLeaveHoursToday > 0) {
                    $earlyLeaveDays++;
                    $earlyLeaveHours += $earlyLeaveHoursToday;
                }
            }
        }

        return [
            'total_work_days' => $totalWorkDays,
            'total_work_hours' => round($totalWorkHours, 2),
            'total_overtime_hours' => round($totalOvertimeHours, 2),
            'average_daily_hours' => $totalWorkDays > 0 ? round($totalWorkHours / $totalWorkDays, 2) : 0,
            'late_days' => $lateDays,
            'late_hours' => round($lateHours, 2),
            'early_leave_days' => $earlyLeaveDays,
            'early_leave_hours' => round($earlyLeaveHours, 2),
            'absent_days' => cal_days_in_month(CAL_GREGORIAN, $month, $year) - $totalWorkDays, // Simplistic approach
        ];
    }

    public function getAttendanceRate(int $employeeId, Carbon $startDate, Carbon $endDate): float
    {
        $totalDays = $endDate->diffInDays($startDate) + 1;

        if ($totalDays <= 0) {
            return 0.0;
        }

        $attendanceCount = AttendanceRecord::forEmployee($employeeId)
            ->whereBetween('date', [$startDate, $endDate])
            ->distinct('date')
            ->count('date');

        return round(($attendanceCount / $totalDays) * 100, 2);
    }

    // Note: This helper references ShiftService which would need to be injected into this service
    // The full implementation would require dependency injection
}
