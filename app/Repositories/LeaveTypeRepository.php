<?php

declare(strict_types=1);
namespace App\Repositories;

use App\Interfaces\ILeaveTypeRepository;
use App\Models\LeaveType;
use Illuminate\Database\Eloquent\Collection;

class LeaveTypeRepository extends BaseRepository implements ILeaveTypeRepository
{
    public function __construct(LeaveType $model)
    {
        $this->model = $model;
    }

    public function getAll(array $filters = [], array $with = []): Collection
    {
        if (empty($filters) && empty($with)) {
            // Cache frequently accessed leave types list - TTL: 1 hour
            return \Cache::remember('leave_types.list', 3600, function () {
                return $this->model->select('id', 'name')->orderBy('name')->get();
            });
        }

        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function getById(int $id, array $with = []): ?LeaveType
    {
        return $this->find($id, $with);
    }

    public function create(array $data): LeaveType
    {
        return parent::create($data);
    }

    public function update(int $id, array $data): LeaveType
    {
        return parent::update($id, $data);
    }

    public function delete(int $id): bool
    {
        return parent::delete($id);
    }
}
