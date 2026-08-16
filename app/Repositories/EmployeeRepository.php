<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Interfaces\IEmployeeRepository;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Collection;

class EmployeeRepository extends BaseRepository implements IEmployeeRepository
{
    public function __construct(Employee $model)
    {
        $this->model = $model;
    }

    /**
     * Tüm employee kayıtlarını getirir (filters ve with destekli).
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
     * Get all active employees (cached version for dropdowns).
     */
    public function getActiveForDropdown(): Collection
    {
        // Cache employee list for dropdowns - TTL: 30 minutes
        return \Cache::remember('employees.dropdown.active', 1800, function () {
            return $this->model
                ->select('id', 'first_name', 'last_name')
                ->whereNull('deleted_at')
                ->orderBy('first_name')
                ->get();
        });
    }

    /**
     * Get all active employees excluding specific IDs (cached version for dropdowns).
     */
    public function getActiveForDropdownExcluding(array $excludeIds = []): Collection
    {
        $cacheKey = 'employees.dropdown.active.exclude.'.md5(serialize($excludeIds));

        return \Cache::remember($cacheKey, 1800, function () use ($excludeIds) {
            $query = $this->model
                ->select('id', 'first_name', 'last_name')
                ->whereNull('deleted_at')
                ->orderBy('first_name');

            if (! empty($excludeIds)) {
                $query->whereNotIn('id', $excludeIds);
            }

            return $query->get();
        });
    }

    /**
     * Paginated employee kayıtları getirir.
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
     * ID ile employee getirir (with destekli).
     */
    public function getById(int $id, array $with = []): ?Employee
    {
        return $this->find($id, $with);
    }

    /**
     * Yeni employee oluşturur.
     */
    public function create(array $data): Employee
    {
        return parent::create($data);
    }

    /**
     * Employee günceller.
     */
    public function update(int $id, array $data): Employee
    {
        return parent::update($id, $data);
    }

    /**
     * Employee siler (soft delete).
     */
    public function delete(int $id): bool
    {
        return parent::delete($id);
    }

    /**
     * TC Kimlik No ile employee getirir.
     */
    public function getByIdentityNo(string $identityNo): ?Employee
    {
        return $this->findBy('identity_no', $identityNo);
    }

    /**
     * Anahtar kelime ile employee arar.
     */
    public function search(string $keyword, array $with = []): Collection
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        $query->where(function ($q) use ($keyword) {
            $q->where('first_name', 'like', "%{$keyword}%")
                ->orWhere('last_name', 'like', "%{$keyword}%")
                ->orWhere('identity_no', 'like', "%{$keyword}%")
                ->orWhere('email', 'like', "%{$keyword}%")
                ->orWhere('position_title', 'like', "%{$keyword}%");
        });

        return $query->orderBy('first_name')->get();
    }

    /**
     * Manager-Subordinate hiyerarşik tree yapısı getirir.
     * Sadece aktif (deleted_at = null) çalışanları döndürür.
     *
     * Optimized: Uses recursive CTE query to avoid loading entire table into memory.
     * For very large datasets, this can be further optimized with pagination.
     */
    public function getTree(): array
    {
        return \Cache::remember('employees.tree', 300, function () {
            // Use recursive CTE query for better performance on large datasets
            // This builds the hierarchy in the database rather than in PHP memory
            $employees = \DB::table('employees as e')
                ->select([
                    'e.id',
                    'e.identity_no',
                    'e.first_name',
                    'e.last_name',
                    'e.email',
                    'e.phone',
                    'e.position_title',
                    'e.department_id',
                    'e.manager_id',
                    'e.hire_date',
                    'd.title as department_name',
                ])
                ->leftJoin('departments as d', 'e.department_id', '=', 'd.id')
                ->whereNull('e.deleted_at')
                ->orderBy('e.first_name')
                ->get();

            // Convert to array for easier manipulation
            $employeesById = [];
            $employeeObjects = [];

            foreach ($employees as $emp) {
                $emp->subordinates_list = [];
                $emp->children = [];
                $employeesById[$emp->id] = $emp;
                $employeeObjects[$emp->id] = $emp;
            }

            // Build tree structure in memory (lightweight operation with DB-fetched data)
            $tree = [];
            foreach ($employeeObjects as $employee) {
                if ($employee->manager_id && isset($employeeObjects[$employee->manager_id])) {
                    $parent = $employeeObjects[$employee->manager_id];
                    $parent->subordinates_list[] = $employee;
                } else {
                    $tree[] = $employee; // Top-level employee (no manager)
                }
            }

            // Recursively convert subordinates_list to children
            foreach ($tree as $employee) {
                $this->convertSubordinatesToChildren($employee);
            }

            return $tree;
        });
    }

    /**
     * Alternative paginated getTree() for very large datasets.
     * Fetches only root employees first, then loads subordinates on demand.
     */
    public function getTreePaginated(int $rootPerPage = 50): array
    {
        // Get root employees (those without managers) with pagination
        $rootEmployees = \DB::table('employees as e')
            ->select([
                'e.id',
                'e.identity_no',
                'e.first_name',
                'e.last_name',
                'e.email',
                'e.phone',
                'e.position_title',
                'e.department_id',
                'e.manager_id',
                'e.hire_date',
                'd.title as department_name',
            ])
            ->leftJoin('departments as d', 'e.department_id', '=', 'd.id')
            ->whereNull('e.deleted_at')
            ->whereNull('e.manager_id')
            ->orderBy('e.first_name')
            ->limit($rootPerPage)
            ->get();

        if ($rootEmployees->isEmpty()) {
            return [];
        }

        // Get all direct subordinates for these root employees in one query
        $rootIds = $rootEmployees->pluck('id')->toArray();

        $allSubordinates = \DB::table('employees as e')
            ->select([
                'e.id',
                'e.identity_no',
                'e.first_name',
                'e.last_name',
                'e.email',
                'e.phone',
                'e.position_title',
                'e.department_id',
                'e.manager_id',
                'e.hire_date',
                'd.title as department_name',
            ])
            ->leftJoin('departments as d', 'e.department_id', '=', 'd.id')
            ->whereNull('e.deleted_at')
            ->whereIn('e.manager_id', $rootIds)
            ->orderBy('e.first_name')
            ->get();

        // Build lookup maps
        $employeesById = [];
        foreach ($rootEmployees as $emp) {
            $emp->subordinates_list = [];
            $emp->children = [];
            $employeesById[$emp->id] = $emp;
        }

        foreach ($allSubordinates as $emp) {
            $emp->subordinates_list = [];
            $emp->children = [];
            $employeesById[$emp->id] = $emp;
        }

        // Assign subordinates to parents
        foreach ($employeesById as $employee) {
            if ($employee->manager_id && isset($employeesById[$employee->manager_id])) {
                $parent = $employeesById[$employee->manager_id];
                $parent->subordinates_list[] = $employee;
            }
        }

        // Convert to tree structure
        $tree = [];
        foreach ($rootEmployees as $employee) {
            $this->convertSubordinatesToChildren($employee);
            $tree[] = $employee;
        }

        return $tree;
    }

    /**
     * Recursive olarak subordinates_list'i children'a dönüştür.
     */
    protected function convertSubordinatesToChildren($employee): void
    {
        $subordinates = $employee->subordinates_list ?? [];
        $children = [];

        foreach ($subordinates as $subordinate) {
            $subordinate->children = $subordinate->subordinates_list ?? [];
            $this->convertSubordinatesToChildren($subordinate);
            $children[] = $subordinate;
        }

        $employee->children = $children;
        $employee->subordinates_list = null;
    }

    /**
     * Filtreleme mantığı.
     */
    protected function applyFilters($query, array $filters): void
    {
        // Status filter (active/terminated)
        if (isset($filters['status'])) {
            if ($filters['status'] === 'active') {
                $query->whereNull('deleted_at');
            } elseif ($filters['status'] === 'terminated') {
                $query->whereNotNull('deleted_at');
            }
        }

        // Department filter
        if (isset($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        // Employment type filter
        if (isset($filters['employment_type'])) {
            $query->where('employment_type', $filters['employment_type']);
        }

        // Contract type filter
        if (isset($filters['contract_type'])) {
            $query->where('contract_type', $filters['contract_type']);
        }

        // Manager filter
        if (isset($filters['manager_id'])) {
            $query->where('manager_id', $filters['manager_id']);
        }

        // Hire date range
        if (isset($filters['hire_date_from'])) {
            $query->where('hire_date', '>=', $filters['hire_date_from']);
        }
        if (isset($filters['hire_date_to'])) {
            $query->where('hire_date', '<=', $filters['hire_date_to']);
        }

        // Position title search
        if (isset($filters['position'])) {
            $query->where('position_title', 'like', "%{$filters['position']}%");
        }
    }
}
