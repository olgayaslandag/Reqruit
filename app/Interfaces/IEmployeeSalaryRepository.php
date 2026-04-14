<?php

declare(strict_types=1);

namespace App\Interfaces;

use App\Models\EmployeeSalary;
use Illuminate\Database\Eloquent\Collection;

interface IEmployeeSalaryRepository
{
    public function getAll(array $filters = [], array $with = []): Collection;

    public function getPaginated(array $filters = [], array $with = [], int $perPage = 15);

    public function getById(int $id, array $with = []): ?EmployeeSalary;

    public function create(array $data): EmployeeSalary;

    public function update(int $id, array $data): EmployeeSalary;

    public function delete(int $id): bool;

    public function getByEmployee(int $employeeId, array $with = []): Collection;

    public function getActiveByEmployee(int $employeeId, ?string $date = null): Collection;

    public function getByComponent(int $componentId): Collection;

    public function endCurrent(int $employeeId, int $componentId, string $endDate): EmployeeSalary;

    public function getTotalFixedEarnings(int $employeeId, ?string $date = null): float;

    public function getTotalFixedDeductions(int $employeeId, ?string $date = null): float;
}
