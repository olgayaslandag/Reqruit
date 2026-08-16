<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Interfaces\IAttendanceAdjustmentRepository;
use App\Models\AttendanceAdjustment;

class AttendanceAdjustmentRepository extends BaseRepository implements IAttendanceAdjustmentRepository
{
    public function __construct(AttendanceAdjustment $model)
    {
        $this->model = $model;
    }

    /**
     * Get all attendance adjustment records with filters.
     */
    public function getAll(array $filters = [], array $with = [])
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Get paginated attendance adjustment records.
     */
    public function getPaginated(array $filters = [], array $with = [], int $perPage = 15)
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Find attendance adjustment by ID.
     */
    public function getById(int $id, array $with = []): ?AttendanceAdjustment
    {
        return $this->find($id, $with);
    }

    /**
     * Create a new attendance adjustment.
     */
    public function create(array $data): AttendanceAdjustment
    {
        return parent::create($data);
    }

    /**
     * Update an existing attendance adjustment.
     */
    public function update(int $id, array $data): AttendanceAdjustment
    {
        return parent::update($id, $data);
    }

    /**
     * Delete an attendance adjustment.
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
        if (isset($filters['employee_id'])) {
            $query->where('employee_id', $filters['employee_id']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['adjustment_date'])) {
            $query->where('adjustment_date', '>=', $filters['adjustment_date'])
                ->where('adjustment_date', '<=', $filters['adjustment_date']);
        }

        if (isset($filters['requested_by'])) {
            $query->where('requested_by', $filters['requested_by']);
        }
    }
}
