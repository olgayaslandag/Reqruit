<?php

declare(strict_types=1);

namespace App\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ISubmissionRepository
{
    /**
     * Get submissions with optional limit/offset for memory-safe queries.
     * WARNING: Calling without limit will load all records into memory.
     *
     * @param  array  $filters  Filter options
     * @param  int|null  $limit  Maximum records to return (null = no limit, dangerous for 200K+ records)
     * @param  int  $offset  Number of records to skip
     */
    public function getAll(array $filters = [], ?int $limit = null, int $offset = 0): Collection;

    /**
     * Get paginated submissions using offset-based pagination.
     */
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    /**
     * Get paginated submissions using cursor-based pagination (efficient for large datasets).
     *
     * @param  array  $filters  Filter options
     * @param  int  $perPage  Items per page
     * @param  string|null  $cursor  Encoded cursor for next page (base64 encoded 'id,timestamp')
     */
    public function getCursorPaginated(array $filters = [], int $perPage = 15, ?string $cursor = null): array;

    public function getById(int $id);

    public function getByReferenceNo(string $referenceNo);

    public function create(array $data);

    public function update(int $id, array $data);

    public function updateStatus(int $id, string $status);

    public function updateInvestigation(int $id, string $investigation, ?string $notes = null);

    public function delete(int $id);

    public function getWithDetails(int $id);
}
