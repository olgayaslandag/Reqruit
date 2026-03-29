<?php

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
