<?php

namespace App\Services;

use App\Models\Holiday;
use App\Models\WorkCalendar;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class CalendarService
{
    public function createWorkCalendar(array $data): WorkCalendar
    {
        return WorkCalendar::create($data);
    }

    public function updateWorkCalendar(WorkCalendar $calendar, array $data): WorkCalendar
    {
        $calendar->update($data);

        return $calendar;
    }

    public function addHoliday(int $calendarId, array $data): Holiday
    {
        $data['work_calendar_id'] = $calendarId;

        return Holiday::create($data);
    }

    public function isBusinessDay(int $calendarId, Carbon $date): bool
    {
        // Check if date is weekend (Saturday = 6, Sunday = 0)
        if ($date->isWeekend()) {
            return false;
        }

        // Check if date is a holiday
        return ! $this->isHoliday($calendarId, $date);
    }

    public function isHoliday(int $calendarId, Carbon $date): bool
    {
        return Holiday::where('work_calendar_id', $calendarId)
            ->where(function ($query) use ($date) {
                $query->whereDate('date', $date)
                    ->orWhere(function ($q) use ($date) {
                        $q->where('is_recurring', true)
                            ->whereMonth('date', $date->month)
                            ->whereDay('date', $date->day);
                    });
            })
            ->exists();
    }

    public function getHolidaysInRange(int $calendarId, Carbon $startDate, Carbon $endDate): Collection
    {
        return Holiday::where('work_calendar_id', $calendarId)
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('date', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        // For recurring holidays, we need to check if they fall within the range
                        $q->where('is_recurring', true)
                            ->whereRaw('MONTH(date) BETWEEN MONTH(?) AND MONTH(?)', [$startDate, $endDate])
                            ->whereRaw('DAY(date) BETWEEN DAY(?) AND DAY(?)', [$startDate, $endDate]);
                    });
            })
            ->orderBy('date')
            ->get();
    }

    public function getBusinessDaysCount(int $calendarId, Carbon $startDate, Carbon $endDate): int
    {
        $businessDays = 0;
        $currentDate = clone $startDate;

        while ($currentDate->lessThanOrEqualTo($endDate)) {
            if ($this->isBusinessDay($calendarId, $currentDate)) {
                $businessDays++;
            }
            $currentDate->addDay();
        }

        return $businessDays;
    }

    public function getNextBusinessDay(int $calendarId, Carbon $fromDate): Carbon
    {
        $nextDay = (clone $fromDate)->addDay();

        while (! $this->isBusinessDay($calendarId, $nextDay)) {
            $nextDay->addDay();
        }

        return $nextDay;
    }

    public function getPreviousBusinessDay(int $calendarId, Carbon $fromDate): Carbon
    {
        $prevDay = (clone $fromDate)->subDay();

        while (! $this->isBusinessDay($calendarId, $prevDay)) {
            $prevDay->subDay();
        }

        return $prevDay;
    }

    public function toggleWorkCalendarStatus(int $calendarId, bool $status): WorkCalendar
    {
        $calendar = WorkCalendar::findOrFail($calendarId);
        $calendar->is_active = $status;
        $calendar->save();

        return $calendar;
    }

    public function deleteHoliday(int $holidayId): bool
    {
        $holiday = Holiday::findOrFail($holidayId);

        return $holiday->delete();
    }
}
