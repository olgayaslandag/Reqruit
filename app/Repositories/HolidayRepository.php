<?php

declare(strict_types=1);
namespace App\Repositories;

use App\Interfaces\IHolidayRepository;
use App\Models\Holiday;

class HolidayRepository extends BaseRepository implements IHolidayRepository
{
    public function __construct(Holiday $model)
    {
        $this->model = $model;
    }

    /**
     * Get all holiday records with filters.
     */
    public function getAll(array $filters = [], array $with = [])
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('date', 'asc')->get();
    }

    /**
     * Get paginated holiday records.
     */
    public function getPaginated(array $filters = [], array $with = [], int $perPage = 15)
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('date', 'asc')->paginate($perPage);
    }

    /**
     * Find holiday by ID.
     */
    public function getById(int $id, array $with = []): ?Holiday
    {
        return $this->find($id, $with);
    }

    /**
     * Create a new holiday.
     */
    public function create(array $data): Holiday
    {
        return parent::create($data);
    }

    /**
     * Update an existing holiday.
     */
    public function update(int $id, array $data): Holiday
    {
        return parent::update($id, $data);
    }

    /**
     * Delete a holiday.
     */
    public function delete(int $id): bool
    {
        return parent::delete($id);
    }

    /**
     * Apply filters to the query.
     */
    protected function applyFilters(mixed $query, array $filters): void
    {
        if (isset($filters['work_calendar_id'])) {
            $query->where('work_calendar_id', $filters['work_calendar_id']);
        }

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['year'])) {
            $query->whereYear('date', $filters['year']);
        }

        if (isset($filters['start_date']) && isset($filters['end_date'])) {
            $query->whereBetween('date', [$filters['start_date'], $filters['end_date']]);
        }
    }
}
