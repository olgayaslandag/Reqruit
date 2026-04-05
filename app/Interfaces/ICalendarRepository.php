<?php

declare(strict_types=1);

namespace App\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface ICalendarRepository extends BaseInterface
{
    /**
     * Get all work calendars with optional filtering.
     */
    public function all(array $filters = [], array $with = []): Collection;

    /**
     * Get paginated work calendars.
     */
    public function paginate(array $filters = [], array $with = [], int $perPage = 15): LengthAwarePaginator;

    /**
     * Find calendar by name.
     */
    public function findByName(string $name): ?Model;

    /**
     * Get active calendars only.
     */
    public function getActive(): Collection;

    /**
     * Toggle calendar active status.
     */
    public function toggleStatus(int $id, bool $status): Model;

    /**
     * Get calendar with holidays.
     */
    public function getWithHolidays(int $id): ?Model;
}
