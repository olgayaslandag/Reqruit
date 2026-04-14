<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Interfaces\ILeaveEntitlementRepository;
use App\Models\LeaveEntitlement;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class LeaveEntitlementRepository extends BaseRepository implements ILeaveEntitlementRepository
{
    public function __construct(LeaveEntitlement $model)
    {
        $this->model = $model;
    }

    public function getAll(array $filters = [], array $with = []): Collection
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function getPaginated(array $filters = [], array $with = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->select('id', 'employee_id', 'leave_type_id', 'entitled_days', 'used_days', 'calculation_year_start', 'accrual_date', 'can_carry_over', 'max_carry_over_days');

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getByEmployeeAndYear(int $employeeId, string $year, array $with = []): Collection
    {
        $query = $this->model->where('employee_id', $employeeId)
            ->whereYear('calculation_year_start', $year);

        if (! empty($with)) {
            $query->with($with);
        }

        return $query->get();
    }

    public function getById(int $id, array $with = []): ?LeaveEntitlement
    {
        return $this->find($id, $with);
    }

    public function create(array $data): LeaveEntitlement
    {
        return parent::create($data);
    }

    public function update(int $id, array $data): LeaveEntitlement
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

        if (isset($filters['year'])) {
            $query->whereYear('calculation_year_start', $filters['year']);
        }

        if (isset($filters['has_remaining'])) {
            $query->whereColumn('entitled_days', '>', 'used_days');
        }
    }
}
