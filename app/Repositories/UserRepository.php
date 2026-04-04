<?php

declare(strict_types=1);
namespace App\Repositories;

use App\Interfaces\IUserRepository;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserRepository extends BaseRepository implements IUserRepository
{
    public function __construct(User $model)
    {
        $this->model = $model;
    }

    /**
     * Get all users records with filters.
     */
    public function getAll(array $filters = [], array $with = []): Collection
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Get paginated user records.
     */
    public function getPaginated(array $filters = [], array $with = [], int $perPage = 15)
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Find user by ID.
     */
    public function getById(int $id, array $with = []): ?User
    {
        return $this->find($id, $with);
    }

    /**
     * Create a new user.
     */
    public function create(array $data): User
    {
        return parent::create($data);
    }

    /**
     * Update an existing user.
     */
    public function update(int $id, array $data): User
    {
        return parent::update($id, $data);
    }

    /**
     * Delete a user.
     */
    public function delete(int $id): bool
    {
        return parent::delete($id);
    }

    /**
     * Apply filters to the query.
     */
    protected function applyFilters(mixed $query, array $filters): void
    {
        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%'.$filters['search'].'%')
                    ->orWhere('email', 'like', '%'.$filters['search'].'%');
            });
        }
    }
}
