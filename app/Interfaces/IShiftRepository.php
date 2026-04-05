<?php

declare(strict_types=1);

namespace App\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface IShiftRepository extends BaseInterface
{
    /**
     * Get all shifts with optional filtering.
     */
    public function all(array $filters = [], array $with = []): Collection;

    /**
     * Get paginated shifts.
     */
    public function paginate(array $filters = [], array $with = [], int $perPage = 15): LengthAwarePaginator;

    /**
     * Find shift by name.
     */
    public function findByName(string $name): ?Model;

    /**
     * Get active shifts only.
     */
    public function getActive(): Collection;

    /**
     * Get shifts by type.
     */
    public function getByType(string $type): Collection;
}
