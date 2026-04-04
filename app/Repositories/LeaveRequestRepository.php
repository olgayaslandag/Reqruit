<?php

declare(strict_types=1);
namespace App\Repositories;

use App\Interfaces\ILeaveRequestRepository;
use App\Models\LeaveRequest;
use Illuminate\Database\Eloquent\Collection;

class LeaveRequestRepository extends BaseRepository implements ILeaveRequestRepository
{
    public function __construct(LeaveRequest $model)
    {
        $this->model = $model;
    }

    public function getAll(array $filters = [], array $with = []): Collection
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        // Filtreleri uygula
        $this->applyFilters($query, $filters);

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function getPaginated(array $filters = [], array $with = [], int $perPage = 15)
    {
        $query = $this->model->query()
            ->select('id', 'employee_id', 'leave_type_id', 'start_date', 'end_date', 'is_half_day', 'status', 'reason');

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getById(int $id, array $with = []): ?LeaveRequest
    {
        return $this->find($id, $with);
    }

    public function getByEmployee(int $employeeId, array $filters = [], array $with = []): Collection
    {
        $query = $this->model->where('employee_id', $employeeId);

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function create(array $data): LeaveRequest
    {
        return parent::create($data);
    }

    public function update(int $id, array $data): LeaveRequest
    {
        return parent::update($id, $data);
    }

    public function delete(int $id): bool
    {
        return parent::delete($id);
    }

    protected function applyFilters($query, array $filters): void
    {
        if (isset($filters['employee_id'])) {
            $query->where('employee_id', $filters['employee_id']);
        }

        if (isset($filters['leave_type_id'])) {
            $query->where('leave_type_id', $filters['leave_type_id']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['approver_id'])) {
            $query->where('approver_id', $filters['approver_id']);
        }

        if (isset($filters['start_date_from'])) {
            $query->where('start_date', '>=', $filters['start_date_from']);
        }

        if (isset($filters['start_date_to'])) {
            $query->where('start_date', '<=', $filters['start_date_to']);
        }

        if (isset($filters['year'])) {
            $query->whereYear('start_date', $filters['year']);
        }
    }
}
