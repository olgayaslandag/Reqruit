<?php

declare(strict_types=1);

namespace App\Repositories;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository
{
    protected Model $model;

    /**
     * Get all records.
     */
    public function all(array $filters = [], array $with = []): Collection
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Get paginated records.
     */
    public function paginate(array $filters = [], array $with = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Find a record by ID.
     */
    public function find(int $id, array $with = []): ?Model
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        return $query->find($id);
    }

    /**
     * Find a record by ID or fail.
     */
    public function findOrFail(int $id, array $with = []): Model
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    /**
     * Find a record by a specific column.
     */
    public function findBy(string $column, mixed $value, array $with = []): ?Model
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        return $query->where($column, $value)->first();
    }

    /**
     * Find a record by a specific column or fail.
     */
    public function findByOrFail(string $column, mixed $value, array $with = []): Model
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        return $query->where($column, $value)->firstOrFail();
    }

    /**
     * Create a new record.
     */
    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    /**
     * Update a record.
     */
    public function update(int $id, array $data): Model
    {
        $model = $this->findOrFail($id);
        $model->update($data);

        return $model;
    }

    /**
     * Delete a record.
     */
    public function delete(int $id): bool
    {
        $model = $this->findOrFail($id);

        return $model->delete();
    }

    /**
     * Apply filters to the query.
     * Override this method in child repositories to add custom filters.
     */
    protected function applyFilters(mixed $query, array $filters): void
    {
        // Override in child classes to add custom filter logic
    }
}
