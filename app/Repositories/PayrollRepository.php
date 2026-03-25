<?php

namespace App\Repositories;

use App\Enums\PayrollStatusEnum;
use App\Interfaces\IPayrollRepository;
use App\Models\PayrollPeriod;
use Illuminate\Database\Eloquent\Collection;

class PayrollRepository extends BaseRepository implements IPayrollRepository
{
    public function __construct(PayrollPeriod $model)
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

        return $query->orderBy('start_date', 'desc')->get();
    }

    public function getPaginated(array $filters = [], array $with = [], int $perPage = 15)
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('start_date', 'desc')->paginate($perPage);
    }

    public function getById(int $id, array $with = []): ?PayrollPeriod
    {
        return $this->find($id, $with);
    }

    public function create(array $data): PayrollPeriod
    {
        return parent::create($data);
    }

    public function update(int $id, array $data): PayrollPeriod
    {
        return parent::update($id, $data);
    }

    public function delete(int $id): bool
    {
        return parent::delete($id);
    }

    public function getByStatus(string $status): Collection
    {
        return $this->model->where('status', $status)->orderBy('start_date', 'desc')->get();
    }

    public function getByDateRange(string $startDate, string $endDate): Collection
    {
        return $this->model->where('start_date', '>=', $startDate)
            ->where('end_date', '<=', $endDate)
            ->orderBy('start_date')
            ->get();
    }

    public function getCurrentPeriod(): ?PayrollPeriod
    {
        $now = now()->toDateString();

        return $this->model->where('start_date', '<=', $now)
            ->where('end_date', '>=', $now)
            ->first();
    }

    public function publish(int $id): PayrollPeriod
    {
        $period = $this->findOrFail($id);
        $period->update(['status' => PayrollStatusEnum::PUBLISHED->value]);

        return $period->fresh();
    }

    public function approve(int $id, int $userId, string $role, ?string $comment = null): PayrollPeriod
    {
        $period = $this->findOrFail($id);
        $statusEnum = PayrollStatusEnum::from($period->status);

        // Calculate next status based on role
        $nextStatus = match ($role) {
            'manager' => PayrollStatusEnum::MANAGER_APPROVED,
            'hr' => PayrollStatusEnum::HR_APPROVED,
            'accounting' => PayrollStatusEnum::ACCOUNTING_APPROVED,
            default => null,
        };

        if ($nextStatus && $statusEnum->value === $nextStatus->value) {
            $period->update(['status' => $nextStatus->value]);
        }

        // Create approval record
        $period->approvals()->create([
            'approver_id' => $userId,
            'role' => $role,
            'status' => 'approved',
            'comment' => $comment,
            'approved_at' => now(),
        ]);

        return $period->fresh();
    }

    protected function applyFilters($query, array $filters): void
    {
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['payment_frequency'])) {
            $query->where('payment_frequency', $filters['payment_frequency']);
        }

        if (isset($filters['start_date_from'])) {
            $query->where('start_date', '>=', $filters['start_date_from']);
        }

        if (isset($filters['start_date_to'])) {
            $query->where('start_date', '<=', $filters['start_date_to']);
        }

        if (isset($filters['end_date_from'])) {
            $query->where('end_date', '>=', $filters['end_date_from']);
        }

        if (isset($filters['end_date_to'])) {
            $query->where('end_date', '<=', $filters['end_date_to']);
        }

        if (isset($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }
    }
}
