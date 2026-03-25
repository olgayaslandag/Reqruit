<?php

namespace App\Interfaces;

use App\Models\PayrollPeriod;
use Illuminate\Database\Eloquent\Collection;

interface IPayrollRepository
{
    public function getAll(array $filters = [], array $with = []): Collection;

    public function getPaginated(array $filters = [], array $with = [], int $perPage = 15);

    public function getById(int $id, array $with = []): ?PayrollPeriod;

    public function create(array $data): PayrollPeriod;

    public function update(int $id, array $data): PayrollPeriod;

    public function delete(int $id): bool;

    public function getByStatus(string $status): Collection;

    public function getByDateRange(string $startDate, string $endDate): Collection;

    public function getCurrentPeriod(): ?PayrollPeriod;

    public function publish(int $id): PayrollPeriod;

    public function approve(int $id, int $userId, string $role, ?string $comment = null): PayrollPeriod;
}
