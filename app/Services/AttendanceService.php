<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\AttendanceSourceEnum;
use App\Enums\AttendanceStatusEnum;
use App\Enums\AttendanceTypeEnum;
use App\Models\AttendanceRecord;
use App\Models\AttendanceSummary;
use App\Models\Employee;
use App\Models\Holiday;
use App\Models\ShiftSchedule;
use Carbon\Carbon;
use Illuminate\Support\Collection;

/**
 * Holiday cache TTL: 24 hours (holidays don't change frequently).
 */
const HOLIDAY_CACHE_TTL = 86400;

class AttendanceService
{
    public function recordAttendance(
        int $employeeId,
        Carbon $date,
        Carbon $time,
        AttendanceTypeEnum $type,
        AttendanceSourceEnum $source,
        array $metadata = []
    ): AttendanceRecord {
        return \DB::transaction(function () use ($employeeId, $date, $time, $type, $source, $metadata) {
            $attendance = new AttendanceRecord([
                'employee_id' => $employeeId,
                'date' => $date,
                'time' => $time->format('H:i'),
                'type' => $type,
                'source' => $source,
                'status' => AttendanceStatusEnum::PRESENT,
                'geolocation' => $metadata['geolocation'] ?? null,
                'ip_address' => $metadata['ip_address'] ?? null,
                'device_id' => $metadata['device_id'] ?? null,
                'notes' => $metadata['notes'] ?? null,
                'processed_at' => now(),
            ]);

            $attendance->save();

            // Update or create summary after recording attendance
            $this->updateAttendanceSummary($employeeId, $date);

            return $attendance;
        });
    }

    public function processDailyAttendance(Carbon $date): void
    {
        // Get all employees who had scheduled shifts or recorded attendance on the given date
        $employees = Employee::whereHas('shiftSchedules', function ($query) use ($date) {
            $query->where('date', $date);
        })
            ->orWhereHas('attendanceRecords', function ($query) use ($date) {
                $query->where('date', $date);
            })
            ->get();

        foreach ($employees as $employee) {
            $this->updateAttendanceSummary($employee->id, $date);
        }
    }

    public function updateAttendanceSummary(int $employeeId, Carbon $date): AttendanceSummary
    {
        $employee = Employee::findOrFail($employeeId);

        // Get the shift schedule for this day
        $shiftSchedule = ShiftSchedule::where('employee_id', $employeeId)
            ->whereDate('date', $date)
            ->first();

        $shift = null;
        if ($shiftSchedule) {
            $shift = $shiftSchedule->shift;
        } else {
            // Use default shift if available
            $shift = $employee->default_shift_id ? $employee->shift : null;
        }

        // Get attendance records for the day
        $attendanceRecords = AttendanceRecord::forEmployee($employeeId)
            ->forDate($date)
            ->orderBy('time')
            ->get();

        // Determine if it's a holiday (cached for 24 hours)
        $isHoliday = $this->isHoliday($employee->work_calendar_id ?? 1, $date);

        // Calculate attendance metrics
        $summaryData = $this->calculateAttendanceMetrics(
            $attendanceRecords,
            $shift,
            $date,
            $isHoliday
        );

        // Find or create summary
        $summary = AttendanceSummary::updateOrCreate(
            [
                'employee_id' => $employeeId,
                'date' => $date,
            ],
            array_merge([
                'employee_id' => $employeeId,
                'date' => $date,
            ], $summaryData)
        );

        return $summary;
    }

    private function calculateAttendanceMetrics(
        Collection $attendanceRecords,
        $shift,
        Carbon $date,
        bool $isHoliday
    ): array {
        $checkIn = null;
        $checkOut = null;
        $breakStart = null;
        $breakEnd = null;

        foreach ($attendanceRecords as $record) {
            $timeStr = is_string($record->time) ? $record->time : $record->time->format('H:i:s');
            $parsedTime = Carbon::parse('today '.$timeStr);

            switch ($record->type) {
                case AttendanceTypeEnum::CHECK_IN:
                    $checkIn = $parsedTime;
                    break;
                case AttendanceTypeEnum::CHECK_OUT:
                    $checkOut = $parsedTime;
                    break;
                case AttendanceTypeEnum::BREAK_START:
                    $breakStart = $parsedTime;
                    break;
                case AttendanceTypeEnum::BREAK_END:
                    $breakEnd = $parsedTime;
                    break;
            }
        }

        $workDayType = $isHoliday ? 'holiday' : 'full_day'; // Default to full day

        if (! $checkIn && ! $checkOut) {
            // Absence
            return [
                'work_day_type' => $workDayType,
                'was_absent' => true,
                'status' => AttendanceStatusEnum::ABSENT,
            ];
        }

        $scheduledStartTime = null;
        $scheduledEndTime = null;

        if ($shift) {
            $startTimeStr = is_string($shift->start_time) ? $shift->start_time : $shift->start_time->format('H:i:s');
            $endTimeStr = is_string($shift->end_time) ? $shift->end_time : $shift->end_time->format('H:i:s');
            $scheduledStartTime = Carbon::parse('today '.$startTimeStr);
            $scheduledEndTime = Carbon::parse('today '.$endTimeStr);
        }

        // Calculate working duration
        $actualWorkingDuration = 0;
        $breakDuration = 0;

        if ($checkIn && $checkOut) {
            $breakDuration = $breakStart && $breakEnd ? $breakEnd->diffInMinutes($breakStart) : ($shift ? $shift->break_duration : 0);
            $actualWorkingDuration = max(0, $checkOut->diffInMinutes($checkIn) - $breakDuration) / 60;
        }

        $expectedWorkingDuration = $shift ? $shift->getExpectedWorkingHoursAttribute() : 0;

        // Determine late and early leave
        $lateDuration = 0;
        $earlyLeaveDuration = 0;

        if ($checkIn && $scheduledStartTime) {
            $toleratedStartTime = $scheduledStartTime->copy()->addMinutes($shift->tolerance_minutes ?? 15);
            if ($checkIn->gt($toleratedStartTime)) {
                $lateDuration = min(max(0, $checkIn->diffInMinutes($scheduledStartTime)) / 60, $expectedWorkingDuration);
            }
        }

        if ($checkOut && $scheduledEndTime) {
            $toleratedEndTime = $scheduledEndTime->copy()->subMinutes($shift->tolerance_minutes ?? 15);
            if ($checkOut->lt($toleratedEndTime)) {
                $earlyLeaveDuration = min(max(0, $scheduledEndTime->diffInMinutes($checkOut)) / 60, $expectedWorkingDuration);
            }
        }

        // Determine overtime
        $overtimeDuration = max(0, $actualWorkingDuration - $expectedWorkingDuration);

        // Determine status
        $status = AttendanceStatusEnum::PRESENT;
        if ($lateDuration > 0 && $earlyLeaveDuration <= 0) {
            $status = AttendanceStatusEnum::LATE;
        } elseif ($earlyLeaveDuration > 0 && $lateDuration <= 0) {
            $status = AttendanceStatusEnum::EARLY_LEAVE;
        } elseif ($overtimeDuration > 0) {
            $status = AttendanceStatusEnum::OVERTIME;
        }

        return [
            'work_day_type' => $workDayType,
            'scheduled_start_time' => $scheduledStartTime?->format('H:i'),
            'actual_check_in' => $checkIn?->format('H:i'),
            'scheduled_end_time' => $scheduledEndTime?->format('H:i'),
            'actual_check_out' => $checkOut?->format('H:i'),
            'actual_break_start' => $breakStart?->format('H:i'),
            'actual_break_end' => $breakEnd?->format('H:i'),
            'expected_working_duration' => $expectedWorkingDuration,
            'actual_working_duration' => round($actualWorkingDuration, 2),
            'overtime_duration' => round($overtimeDuration, 2),
            'late_duration' => round($lateDuration, 2),
            'early_leave_duration' => round($earlyLeaveDuration, 2),
            'was_absent' => false,
            'status' => $status,
        ];
    }

    /**
     * Check if a given date is a holiday for the work calendar.
     * Results are cached for 24 hours as holidays don't change frequently.
     */
    private function isHoliday(int $workCalendarId, Carbon $date): bool
    {
        $cacheKey = "holidays:{$workCalendarId}:{$date->format('Y-m-d')}";

        return \Cache::remember($cacheKey, HOLIDAY_CACHE_TTL, function () use ($workCalendarId, $date) {
            return Holiday::where('work_calendar_id', $workCalendarId)
                ->where(function ($query) use ($date) {
                    $query->whereDate('date', $date)
                        ->orWhere(function ($q) use ($date) {
                            $q->where('is_recurring', true)
                                ->whereMonth('date', $date->month)
                                ->whereDay('date', $date->day);
                        });
                })
                ->exists();
        });
    }

    public function getAttendanceReport(int $employeeId, Carbon $startDate, Carbon $endDate): Collection
    {
        return AttendanceSummary::where('employee_id', $employeeId)
            ->whereBetween('date', [$startDate, $endDate])
            ->orderBy('date')
            ->get();
    }

    public function validateAttendanceRecord(AttendanceRecord $record): bool
    {
        // Basic validation checks
        $employee = $record->employee;

        // Check if employee exists
        if (! $employee) {
            return false;
        }

        // Check if the combination of time and type makes sense
        if ($record->type === AttendanceTypeEnum::CHECK_IN) {
            // Validate that it doesn't overlap with another check-in for the same day
            $existingCheckIns = AttendanceRecord::where('employee_id', $employee->id)
                ->whereDate('date', $record->date)
                ->where('type', AttendanceTypeEnum::CHECK_IN)
                ->where('id', '!=', $record->id)
                ->count();

            if ($existingCheckIns > 0) {
                return false; // Already has a check-in for this date
            }
        }

        // Additional validation rules can be added here
        return true;
    }

    public function manualClockIn(int $employeeId, Carbon $timestamp)
    {
        $employee = Employee::findOrFail($employeeId);

        // Parse the timestamp to extract date and time
        $date = $timestamp->copy()->startOfDay();  // Only date part
        $time = $timestamp; // Time part as-is

        $metadata = [];

        \DB::beginTransaction();
        try {
            // Record the attendance with manually provided time
            $attendance = $this->recordAttendance(
                $employeeId,  // Ensuring we pass integer explicitly
                $date,        // Carbon object for date
                $time,        // Carbon object for time
                AttendanceTypeEnum::CHECK_IN,
                AttendanceSourceEnum::MANUAL,
                $metadata
            );

            \DB::commit();

            // Update summary for that date
            $this->updateAttendanceSummary($employeeId, $date);

            return $attendance;
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }
    }

    public function manualClockOut(int $employeeId, Carbon $timestamp)
    {
        $employee = Employee::findOrFail($employeeId);

        // Parse the timestamp to extract date and time
        $date = $timestamp->copy()->startOfDay();  // Only date part
        $time = $timestamp; // Time part as-is

        $metadata = [];

        \DB::beginTransaction();
        try {
            // Record the attendance with manually provided time
            $attendance = $this->recordAttendance(
                $employeeId,  // Ensuring we pass integer explicitly
                $date,        // Carbon object for date
                $time,        // Carbon object for time
                AttendanceTypeEnum::CHECK_OUT,
                AttendanceSourceEnum::MANUAL,
                $metadata
            );

            \DB::commit();

            // Update summary for that date
            $this->updateAttendanceSummary($employeeId, $date);

            return $attendance;
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }
    }

    public function getFilteredAttendances($filters = [])
    {
        $query = AttendanceRecord::with(['employee.department']);

        // Apply filters
        if (isset($filters['employee_id'])) {
            $query->where('employee_id', $filters['employee_id']);
        }

        if (isset($filters['date'])) {
            $query->whereDate('date', $filters['date']);
        }

        if (isset($filters['start_date']) && isset($filters['end_date'])) {
            $query->whereBetween('date', [$filters['start_date'], $filters['end_date']]);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query->latest()->paginate(15);
    }

    public function getEmployeeAttendances(int $employeeId, $filters = [])
    {
        $query = AttendanceRecord::where('employee_id', $employeeId)->with(['employee.department']);

        if (isset($filters['date'])) {
            $query->whereDate('date', $filters['date']);
        }

        if (isset($filters['start_date']) && isset($filters['end_date'])) {
            $query->whereBetween('date', [$filters['start_date'], $filters['end_date']]);
        }

        return $query->orderBy('date', 'desc')->orderBy('time', 'asc')->paginate(15);
    }

    public function getEmployeeShiftForDate(int $employeeId, Carbon $date): ?object
    {
        // Get the shift schedule for this day
        $shiftSchedule = ShiftSchedule::where('employee_id', $employeeId)
            ->whereDate('date', $date)
            ->first();

        if ($shiftSchedule) {
            return $shiftSchedule->shift;
        }

        // Use default shift if available
        $employee = Employee::findOrFail($employeeId);

        return $employee->default_shift_id ? $employee->shift : null;
    }

    public function clockIn(int $employeeId, ?string $dateString, ?string $timeString, array $requestData)
    {
        $employee = Employee::findOrFail($employeeId);

        // Set current date/time if not provided
        $date = $dateString ? Carbon::parse($dateString) : today();
        $time = $timeString ? Carbon::parse($timeString) : now();

        $metadata = [
            'geolocation' => $requestData['geolocation'] ?? null,
            'ip_address' => $requestData['ip_address'] ?? null,
            'device_id' => $requestData['device_id'] ?? null,
            'notes' => $requestData['notes'] ?? null,
        ];

        \DB::beginTransaction();
        try {
            // Record the attendance
            $attendance = $this->recordAttendance(
                $employee->id,
                $date,
                $time,
                AttendanceTypeEnum::CHECK_IN,
                AttendanceSourceEnum::from($requestData['source']),
                $metadata
            );

            // If successful, also try to determine if this is late arrival
            $shift = $this->getEmployeeShiftForDate($employee->id, $date);
            if ($shift) {
                $startTimeStr = is_string($shift->start_time) ? $shift->start_time : $shift->start_time->format('H:i:s');
                $scheduledStart = Carbon::parse('today '.$startTimeStr);
                if ($time->gt($scheduledStart->addMinutes($shift->tolerance_minutes ?? 15))) {
                    $attendance->status = AttendanceStatusEnum::LATE;
                    $attendance->save();
                }
            }

            \DB::commit();

            return $attendance;
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }
    }

    public function clockOut(int $employeeId, ?string $dateString, ?string $timeString, array $requestData)
    {
        $employee = Employee::findOrFail($employeeId);

        // Set current date/time if not provided
        $date = $dateString ? Carbon::parse($dateString) : today();
        $time = $timeString ? Carbon::parse($timeString) : now();

        $metadata = [
            'geolocation' => $requestData['geolocation'] ?? null,
            'ip_address' => $requestData['ip_address'] ?? null,
            'device_id' => $requestData['device_id'] ?? null,
            'notes' => $requestData['notes'] ?? null,
        ];

        \DB::beginTransaction();
        try {
            // Record the attendance
            $attendance = $this->recordAttendance(
                $employee->id,
                $date,
                $time,
                AttendanceTypeEnum::CHECK_OUT,
                AttendanceSourceEnum::from($requestData['source']),
                $metadata
            );

            // If successful, also try to determine if this is early departure
            $shift = $this->getEmployeeShiftForDate($employee->id, $date);
            if ($shift) {
                $endTimeStr = is_string($shift->end_time) ? $shift->end_time : $shift->end_time->format('H:i:s');
                $scheduledEnd = Carbon::parse('today '.$endTimeStr);
                if ($time->lt($scheduledEnd->subMinutes($shift->tolerance_minutes ?? 15))) {
                    $attendance->status = AttendanceStatusEnum::EARLY_LEAVE;
                    $attendance->save();
                }
            }

            \DB::commit();

            return $attendance;
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }
    }
}
