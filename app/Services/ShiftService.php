<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Employee;
use App\Models\Shift;
use App\Models\ShiftSchedule;
use App\Repositories\ShiftRepository;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class ShiftService
{
    protected ShiftRepository $shiftRepository;

    public function __construct(ShiftRepository $shiftRepository)
    {
        $this->shiftRepository = $shiftRepository;
    }

    public function createShift(array $data): Shift
    {
        return $this->shiftRepository->create($data);
    }

    public function updateShift(Shift $shift, array $data): Shift
    {
        $shift->update($data);

        return $shift->fresh();
    }

    public function assignShiftToEmployee(
        int $employeeId,
        int $shiftId,
        Carbon|string $date,
        ?string $note = null
    ): ShiftSchedule {
        // Convert date if coming as string
        if (is_string($date)) {
            $date = Carbon::parse($date);
        }

        // First, remove any existing assignments for this employee on the specified date
        ShiftSchedule::where('employee_id', $employeeId)
            ->whereDate('date', $date)
            ->delete();

        return ShiftSchedule::create([
            'shift_id' => $shiftId,
            'employee_id' => $employeeId,
            'date' => $date,
            'note' => $note,
        ]);
    }

    public function bulkAssignShift(
        array $employeeIds,
        int $shiftId,
        Carbon|string $startDate,
        Carbon|string|null $endDate = null,
        ?string $recurrence = null
    ): Collection {
        // If no end date is provided, apply the shift for only the start date
        if (! $endDate) {
            $endDate = $startDate instanceof Carbon ? $startDate : Carbon::parse($startDate);
        }

        // Convert string dates to Carbon objects
        if (is_string($startDate)) {
            $startDate = Carbon::parse($startDate);
        }
        if (is_string($endDate)) {
            $endDate = Carbon::parse($endDate);
        }

        $result = collect();

        // If recurrence is daily or weekly, generate dates accordingly
        if ($recurrence === 'daily') {
            // Assign the shift to each day from start to end date
            for ($date = clone $startDate; $date->lessThanOrEqualTo($endDate); $date->addDay()) {
                foreach ($employeeIds as $employeeId) {
                    $result->push($this->assignShiftToEmployee($employeeId, $shiftId, $date));
                }
            }
        } else {
            // Otherwise, apply to each employee for the single date
            foreach ($employeeIds as $employeeId) {
                $result->push($this->assignShiftToEmployee($employeeId, $shiftId, $startDate));
            }
        }

        return $result;
    }

    public function getEmployeeShiftForDate(int $employeeId, Carbon $date): ?Shift
    {
        $shiftSchedule = ShiftSchedule::where('employee_id', $employeeId)
            ->whereDate('date', $date)
            ->first();

        if ($shiftSchedule) {
            return $shiftSchedule->shift;
        }

        // If no schedule found for this specific date, look for the default shift
        $employee = Employee::find($employeeId);
        if ($employee && $employee->default_shift_id) {
            return $employee->shift;
        }

        return null;
    }

    public function getUpcomingShifts(int $employeeId, Carbon $fromDate, Carbon $toDate): Collection
    {
        return ShiftSchedule::where('employee_id', $employeeId)
            ->whereBetween('date', [$fromDate, $toDate])
            ->with(['shift'])
            ->orderBy('date')
            ->get();
    }

    public function getShiftSchedules(int $shiftId, Carbon $fromDate, Carbon $toDate): Collection
    {
        return ShiftSchedule::where('shift_id', $shiftId)
            ->whereBetween('date', [$fromDate, $toDate])
            ->with(['employee'])
            ->get();
    }

    public function calculateShiftHoursForDay(Shift $shift): float
    {
        return $shift->getExpectedWorkingHoursAttribute();
    }

    public function removeShiftAssignment(int $employeeId, Carbon $date): bool
    {
        ShiftSchedule::where('employee_id', $employeeId)
            ->whereDate('date', $date)
            ->delete();

        return true;
    }

    public function getWeeklyScheduleForEmployee(int $employeeId, Carbon $weekStartDate): array
    {
        $weekEndDate = (clone $weekStartDate)->endOfWeek();

        $shiftSchedules = ShiftSchedule::where('employee_id', $employeeId)
            ->whereBetween('date', [$weekStartDate, $weekEndDate])
            ->with(['shift'])
            ->get();

        // Organize by day of week
        $schedule = [];
        for ($i = 0; $i < 7; $i++) {
            $day = (clone $weekStartDate)->addDays($i);
            $daySchedule = $shiftSchedules->firstWhere('date', $day->toDateString());

            $schedule[$day->format('Y-m-d')] = $daySchedule ? [
                'shift' => $daySchedule->shift,
                'note' => $daySchedule->note,
            ] : null;
        }

        return $schedule;
    }
}
