<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Interfaces\IDepartmentRepository;
use App\Models\Department;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class DepartmentRepository extends BaseRepository implements IDepartmentRepository
{
    public function __construct(Department $model)
    {
        $this->model = $model;
    }

    /**
     * Get all departments (cached version for common usage).
     */
    public function getAll(array $filters = []): Collection
    {
        if (empty($filters)) {
            // Cache frequently accessed department list - TTL: 1 hour
            return Cache::remember('departments.list', 3600, function () {
                return Department::select('id', 'title')->orderBy('title')->get();
            });
        }

        $query = Department::query()->select('id', 'title');

        if (isset($filters['parent_id'])) {
            $query->where('parent_id', $filters['parent_id']);
        }

        return $query->orderBy('title')->get();
    }

    /**
     * Get department by ID.
     */
    public function getById(int $id): Department
    {
        return $this->findOrFail($id);
    }

    /**
     * Get department by slug.
     */
    public function getBySlug(string $slug): Department
    {
        return $this->findByOrFail('slug', $slug);
    }

    /**
     * Create a new department.
     */
    public function create(array $data): Department
    {
        return parent::create($data);
    }

    /**
     * Update a department.
     */
    public function update(int $id, array $data): Department
    {
        return parent::update($id, $data);
    }

    /**
     * Get department tree (hierarchical with unlimited levels).
     */
    public function getTree(): Collection
    {
        // Tüm departmanları çek ve manuel olarak hiyerarşik yapı oluştur
        $allDepartments = Department::with('forms')->get()->sortBy('title')->values();

        return $this->buildRecursiveTree($allDepartments);
    }

    /**
     * Build recursive tree structure from flat list of departments.
     */
    private function buildRecursiveTree($departments, $parentId = null): Collection
    {
        $branch = new Collection;

        foreach ($departments as $department) {
            if ($department->parent_id == $parentId) {
                $children = $this->buildRecursiveTree($departments, $department->id);

                // Children collection'ını ilişkiye bağla
                $department->setRelation('children', $children);
                $branch->push($department);
            }
        }

        return $branch;
    }
}
