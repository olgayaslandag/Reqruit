<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Interfaces\ICalendarRepository;
use App\Models\WorkCalendar;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CalendarRepository extends BaseRepository implements ICalendarRepository
{
    public function __construct(WorkCalendar $model)
    {
        $this->model = $model;
    }

    /**
     * Get all work calendars with optional filtering.
     */
    public function all(array $filters = [], array $with = []): Collection
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('name')->get();
    }

    /**
     * Get paginated work calendars.
     */
    public function paginate(array $filters = [], array $with = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('name')->paginate($perPage);
    }

    /**
     * Find calendar by name.
     */
    public function findByName(string $name): ?WorkCalendar
    {
        return $this->model->where('name', $name)->first();
    }

    /**
     * Get active calendars only.
     */
    public function getActive(): Collection
    {
        return $this->model->where('is_active', true)->orderBy('name')->get();
    }

    /**
     * Toggle calendar active status.
     */
    public function toggleStatus(int $id, bool $status): WorkCalendar
    {
        $calendar = $this->findOrFail($id);
        $calendar->is_active = $status;
        $calendar->save();

        return $calendar;
    }

    /**
     * Get calendar with holidays.
     */
    public function getWithHolidays(int $id): ?WorkCalendar
    {
        return $this->model->with('holidays')->find($id);
    }

    /**
     * Apply custom filters to the query.
     */
    protected function applyFilters($query, array $filters): void
    {
        if (isset($filters['search']) && $filters['search']) {
            $query->where('name', 'like', '%'.$filters['search'].'%');
        }

        if (isset($filters['is_active']) && $filters['is_active'] !== null) {
            $query->where('is_active', $filters['is_active']);
        }
    }
}
