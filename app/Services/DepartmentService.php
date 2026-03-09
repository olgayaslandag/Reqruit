<?php

namespace App\Services;

use App\Interfaces\DepartmentInterface;
use Illuminate\Support\Str;

class DepartmentService
{
    public function __construct(
        protected DepartmentInterface $departmentRepository
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
            $data['slug'] = $originalSlug . '-' . $counter++;
        }

        return $this->departmentRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        if (isset($data['title'])) {
            $data['slug'] = $data['slug'] ?? Str::slug($data['title']);
        }

        return $this->departmentRepository->update($id, $data);
    }

    public function delete(int $id)
    {
        return $this->departmentRepository->delete($id);
    }
}
