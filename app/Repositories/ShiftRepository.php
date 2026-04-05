<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Interfaces\IShiftRepository;
use App\Models\Shift;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ShiftRepository extends BaseRepository implements IShiftRepository
{
    public function __construct(Shift $model)
    {
        $this->model = $model;
    }

    /**
     * Get all shifts with optional filtering.
     */
    public function all(array $filters = [], array $with = []): Collection
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('name')->get();
    }

    /**
     * Get paginated shifts.
     */
    public function paginate(array $filters = [], array $with = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('name')->paginate($perPage);
    }

    /**
     * Find shift by name.
     */
    public function findByName(string $name): ?Shift
    {
        return $this->model->where('name', $name)->first();
    }

    /**
     * Get active shifts only.
     */
    public function getActive(): Collection
    {
        return $this->model->where('is_active', true)->orderBy('name')->get();
    }

    /**
     * Get shifts by type.
     */
    public function getByType(string $type): Collection
    {
        return $this->model->where('type', $type)->orderBy('name')->get();
    }

    /**
     * Apply custom filters to the query.
     */
    protected function applyFilters($query, array $filters): void
    {
        if (isset($filters['search']) && $filters['search']) {
            $query->where('name', 'like', '%'.$filters['search'].'%');
        }

        if (isset($filters['type']) && $filters['type']) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['is_night']) && $filters['is_night'] !== null) {
            $query->where('is_night', $filters['is_night']);
        }
    }
}
