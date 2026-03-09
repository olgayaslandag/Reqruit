<?php

namespace App\Repositories;

use App\Interfaces\DepartmentInterface;
use App\Models\Department;

class DepartmentRepository implements DepartmentInterface
{
    public function getAll(array $filters = [])
    {
        $query = Department::query();

        if (isset($filters['parent_id'])) {
            $query->where('parent_id', $filters['parent_id']);
        }

        return $query->orderBy('title')->get();
    }

    public function getById(int $id)
    {
        return Department::findOrFail($id);
    }

    public function getBySlug(string $slug)
    {
        return Department::where('slug', $slug)->firstOrFail();
    }

    public function create(array $data)
    {
        return Department::create($data);
    }

    public function update(int $id, array $data)
    {
        $department = Department::findOrFail($id);
        $department->update($data);
        return $department;
    }

    public function delete(int $id)
    {
        $department = Department::findOrFail($id);
        return $department->delete();
    }

    public function getTree()
    {
        return Department::with('children')->whereNull('parent_id')->orderBy('title')->get();
    }
}
