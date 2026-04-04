<?php

declare(strict_types=1);

namespace App\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface BaseInterface
{
    /**
     * Get all records.
     */
    public function all(array $filters = [], array $with = []): Collection;

    /**
     * Get paginated records.
     */
    public function paginate(array $filters = [], array $with = [], int $perPage = 15): LengthAwarePaginator;

    /**
     * Find a record by ID.
     */
    public function find(int $id, array $with = []): ?Model;

    /**
     * Find a record by ID or fail.
     */
    public function findOrFail(int $id, array $with = []): Model;

    /**
     * Find a record by a specific column.
     */
    public function findBy(string $column, mixed $value, array $with = []): ?Model;

    /**
     * Find a record by a specific column or fail.
     */
    public function findByOrFail(string $column, mixed $value, array $with = []): Model;

    /**
     * Create a new record.
     */
    public function create(array $data): Model;

    /**
     * Update a record.
     */
    public function update(int $id, array $data): Model;

    /**
     * Delete a record.
     */
    public function delete(int $id): bool;
}
