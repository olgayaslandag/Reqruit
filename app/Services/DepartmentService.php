<?php

declare(strict_types=1);

namespace App\Services;

use App\Interfaces\IDepartmentRepository;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class DepartmentService
{
    public function __construct(
        protected IDepartmentRepository $departmentRepository
    ) {}

    public function getAll(array $filters = [])
    {
        return $this->departmentRepository->getAll($filters);
    }

    public function getById(int $id)
    {
        return $this->departmentRepository->getById($id);
    }

    public function getBySlug(string $slug)
    {
        return $this->departmentRepository->getBySlug($slug);
    }

    public function getTree()
    {
        return $this->departmentRepository->getTree();
    }

    public function create(array $data)
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['title']);

        // Ensure unique slug
        $originalSlug = $data['slug'];
        $counter = 1;
        while ($this->departmentRepository->getAll()->contains('slug', $data['slug'])) {
            $data['slug'] = $originalSlug.'-'.$counter++;
        }

        $department = $this->departmentRepository->create($data);
        Cache::forget('departments.list');

        return $department;
    }

    public function update(int $id, array $data)
    {
        if (isset($data['title'])) {
            $data['slug'] = $data['slug'] ?? Str::slug($data['title']);
        }

        $department = $this->departmentRepository->update($id, $data);
        Cache::forget('departments.list');

        return $department;
    }

    public function delete(int $id)
    {
        $result = $this->departmentRepository->delete($id);
        Cache::forget('departments.list');

        return $result;
    }
}
