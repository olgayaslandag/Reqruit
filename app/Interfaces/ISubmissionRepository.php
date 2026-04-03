<?php

namespace App\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ISubmissionRepository
{
    public function getAll(array $filters = []): Collection;

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function getById(int $id);

    public function getByReferenceNo(string $referenceNo);

    public function create(array $data);

    public function update(int $id, array $data);

    public function updateStatus(int $id, string $status);

    public function updateInvestigation(int $id, string $investigation, ?string $notes = null);

    public function delete(int $id);

    public function getWithDetails(int $id);
}
