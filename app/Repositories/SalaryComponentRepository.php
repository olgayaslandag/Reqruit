<?php

declare(strict_types=1);
namespace App\Repositories;

use App\Interfaces\ISalaryComponentRepository;
use App\Models\SalaryComponent;
use Illuminate\Database\Eloquent\Collection;

class SalaryComponentRepository extends BaseRepository implements ISalaryComponentRepository
{
    public function __construct(SalaryComponent $model)
    {
        $this->model = $model;
    }

    public function getAll(array $filters = [], array $with = []): Collection
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('sort_order')->orderBy('name')->get();
    }

    public function getPaginated(array $filters = [], array $with = [], int $perPage = 15)
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('sort_order')->orderBy('name')->paginate($perPage);
    }

    public function getById(int $id, array $with = []): ?SalaryComponent
    {
        return $this->find($id, $with);
    }

    public function create(array $data): SalaryComponent
    {
        return parent::create($data);
    }

    public function update(int $id, array $data): SalaryComponent
    {
        return parent::update($id, $data);
    }

    public function delete(int $id): bool
    {
        return parent::delete($id);
    }

    public function getByCode(string $code): ?SalaryComponent
    {
        return $this->findBy('code', $code);
    }

    public function getActive(): Collection
    {
        return $this->model->active()->orderBy('sort_order')->orderBy('name')->get();
    }

    public function getEarnings(): Collection
    {
        return $this->model->active()->earnings()->orderBy('sort_order')->orderBy('name')->get();
    }

    public function getDeductions(): Collection
    {
        return $this->model->active()->deductions()->orderBy('sort_order')->orderBy('name')->get();
    }

    public function getFixed(): Collection
    {
        return $this->model->active()->fixed()->orderBy('sort_order')->orderBy('name')->get();
    }

    public function getVariable(): Collection
    {
        return $this->model->active()->variable()->orderBy('sort_order')->orderBy('name')->get();
    }

    protected function applyFilters($query, array $filters): void
    {
        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        if (isset($filters['is_taxable'])) {
            $query->where('is_taxable', $filters['is_taxable']);
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                    ->orWhere('code', 'like', "%{$filters['search']}%");
            });
        }
    }
}
