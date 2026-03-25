<?php

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
     */
    public function getTree(): array
    {
        $allEmployees = $this->model
            ->with('department')
            ->whereNull('deleted_at')
            ->orderBy('first_name')
            ->get();

        $tree = [];
        $employeeMap = [];

        // İlk olarak tüm çalışanları map'e ekle (setAttribute kullanarak)
        foreach ($allEmployees as $employee) {
            $employee->setAttribute('subordinates_list', []);
            $employeeMap[$employee->id] = $employee;
        }

        // Sonra manager-subordinate ilişkisini kur
        foreach ($employeeMap as $employee) {
            if ($employee->manager_id && isset($employeeMap[$employee->manager_id])) {
                $parent = $employeeMap[$employee->manager_id];
                $parentSubordinates = $parent->getAttribute('subordinates_list') ?? [];
                $parentSubordinates[] = $employee;
                $parent->setAttribute('subordinates_list', $parentSubordinates);
            } else {
                $tree[] = $employee; // Üst seviye (manager'ı yok)
            }
        }

        // subordinates_list'i children olarak yeniden adlandır
        foreach ($tree as $employee) {
            $employee->setAttribute('children', $employee->getAttribute('subordinates_list') ?? []);
            $this->convertSubordinatesToChildren($employee);
        }

        return $tree;
    }

    /**
     * Recursive olarak subordinates_list'i children'a dönüştür.
     */
    protected function convertSubordinatesToChildren($employee): void
    {
        $subordinates = $employee->getAttribute('subordinates_list') ?? [];
        $children = [];

        foreach ($subordinates as $subordinate) {
            $subordinate->setAttribute('children', $subordinate->getAttribute('subordinates_list') ?? []);
            $this->convertSubordinatesToChildren($subordinate);
            $children[] = $subordinate;
        }

        $employee->setAttribute('children', $children);
        $employee->setAttribute('subordinates_list', null);
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
