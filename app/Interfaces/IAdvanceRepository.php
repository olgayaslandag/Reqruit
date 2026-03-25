<?php

namespace App\Interfaces;

use App\Models\AdvanceRequest;
use Illuminate\Database\Eloquent\Collection;

interface IAdvanceRepository
{
    public function getAll(array $filters = [], array $with = []): Collection;

    public function getPaginated(array $filters = [], array $with = [], int $perPage = 15);

    public function getById(int $id, array $with = []): ?AdvanceRequest;

    public function create(array $data): AdvanceRequest;

    public function update(int $id, array $data): AdvanceRequest;

    public function delete(int $id): bool;

    public function getByEmployee(int $employeeId): Collection;

    public function getPending(): Collection;

    public function getApproved(): Collection;

    public function getPaid(): Collection;

    public function approve(int $id, int $approverId): AdvanceRequest;

    public function reject(int $id, int $approverId, string $reason): AdvanceRequest;

    public function markAsPaid(int $id, ?string $paymentDate = null): AdvanceRequest;

    public function cancel(int $id): AdvanceRequest;
}
