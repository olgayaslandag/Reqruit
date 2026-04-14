<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Interfaces\IEmployeeSalaryRepository;
use App\Models\EmployeeSalary;
use Illuminate\Database\Eloquent\Collection;

class EmployeeSalaryRepository extends BaseRepository implements IEmployeeSalaryRepository
{
    public function __construct(EmployeeSalary $model)
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

        return $query->orderBy('start_date', 'desc')->get();
    }

    public function getPaginated(array $filters = [], array $with = [], int $perPage = 15)
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('start_date', 'desc')->paginate($perPage);
    }

    public function getById(int $id, array $with = []): ?EmployeeSalary
    {
        return $this->find($id, $with);
    }

    public function create(array $data): EmployeeSalary
    {
        return parent::create($data);
    }

    public function update(int $id, array $data): EmployeeSalary
    {
        return parent::update($id, $data);
    }

    public function delete(int $id): bool
    {
        return parent::delete($id);
    }

    public function getByEmployee(int $employeeId, array $with = []): Collection
    {
        return $this->model->where('employee_id', $employeeId)
            ->with($with)
            ->orderBy('start_date', 'desc')
            ->get();
    }

    public function getActiveByEmployee(int $employeeId, ?string $date = null): Collection
    {
        $date = $date ?? now()->toDateString();

        return $this->model->where('employee_id', $employeeId)
            ->activeOn($date)
            ->with('salaryComponent')
            ->get();
    }

    public function getByComponent(int $componentId): Collection
    {
        return $this->model->where('salary_component_id', $componentId)
            ->orderBy('start_date', 'desc')
            ->get();
    }

    public function endCurrent(int $employeeId, int $componentId, string $endDate): EmployeeSalary
    {
        $current = $this->model->where('employee_id', $employeeId)
            ->where('salary_component_id', $componentId)
            ->activeOn(now()->toDateString())
            ->first();

        if ($current) {
            $current->update(['end_date' => $endDate]);
        }

        return $current;
    }

    public function getTotalFixedEarnings(int $employeeId, ?string $date = null): float
    {
        return (float) $this->getActiveByEmployee($employeeId, $date)
            ->whereHas('salaryComponent', function ($q) {
                $q->where('type', 'earning')->where('category', 'fixed');
            })
            ->sum('amount');
    }

    public function getTotalFixedDeductions(int $employeeId, ?string $date = null): float
    {
        return (float) $this->getActiveByEmployee($employeeId, $date)
            ->whereHas('salaryComponent', function ($q) {
                $q->where('type', 'deduction')->where('category', 'fixed');
            })
            ->sum('amount');
    }

    protected function applyFilters($query, array $filters): void
    {
        if (isset($filters['employee_id'])) {
            $query->where('employee_id', $filters['employee_id']);
        }

        if (isset($filters['salary_component_id'])) {
            $query->where('salary_component_id', $filters['salary_component_id']);
        }

        if (isset($filters['payment_frequency'])) {
            $query->where('payment_frequency', $filters['payment_frequency']);
        }

        if (isset($filters['start_date_from'])) {
            $query->where('start_date', '>=', $filters['start_date_from']);
        }

        if (isset($filters['start_date_to'])) {
            $query->where('start_date', '<=', $filters['start_date_to']);
        }

        if (isset($filters['end_date'])) {
            $query->where(function ($q) use ($filters) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', $filters['end_date']);
            });
        }
    }
}
