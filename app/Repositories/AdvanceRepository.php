<?php

declare(strict_types=1);
namespace App\Repositories;

use App\Enums\AdvanceStatusEnum;
use App\Interfaces\IAdvanceRepository;
use App\Models\AdvanceRequest;
use Illuminate\Database\Eloquent\Collection;

class AdvanceRepository extends BaseRepository implements IAdvanceRepository
{
    public function __construct(AdvanceRequest $model)
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

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function getPaginated(array $filters = [], array $with = [], int $perPage = 15)
    {
        $query = $this->model->query();

        if (! empty($with)) {
            $query->with($with);
        }

        $this->applyFilters($query, $filters);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getById(int $id, array $with = []): ?AdvanceRequest
    {
        return $this->find($id, $with);
    }

    public function create(array $data): AdvanceRequest
    {
        return parent::create($data);
    }

    public function update(int $id, array $data): AdvanceRequest
    {
        return parent::update($id, $data);
    }

    public function delete(int $id): bool
    {
        return parent::delete($id);
    }

    public function getByEmployee(int $employeeId): Collection
    {
        return $this->model->where('employee_id', $employeeId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getPending(): Collection
    {
        return $this->model->pending()->orderBy('created_at', 'desc')->get();
    }

    public function getApproved(): Collection
    {
        return $this->model->approved()->orderBy('created_at', 'desc')->get();
    }

    public function getPaid(): Collection
    {
        return $this->model->paid()->orderBy('created_at', 'desc')->get();
    }

    public function approve(int $id, int $approverId): AdvanceRequest
    {
        $advance = $this->findOrFail($id);

        $advance->update([
            'status' => AdvanceStatusEnum::APPROVED->value,
            'approver_id' => $approverId,
        ]);

        return $advance->fresh();
    }

    public function reject(int $id, int $approverId, string $reason): AdvanceRequest
    {
        $advance = $this->findOrFail($id);

        $advance->update([
            'status' => AdvanceStatusEnum::REJECTED->value,
            'approver_id' => $approverId,
            'rejection_reason' => $reason,
        ]);

        return $advance->fresh();
    }

    public function markAsPaid(int $id, ?string $paymentDate = null): AdvanceRequest
    {
        $advance = $this->findOrFail($id);

        $advance->update([
            'status' => AdvanceStatusEnum::PAID->value,
            'payment_date' => $paymentDate ?? now()->toDateString(),
        ]);

        return $advance->fresh();
    }

    public function cancel(int $id): AdvanceRequest
    {
        $advance = $this->findOrFail($id);

        $advance->update([
            'status' => AdvanceStatusEnum::CANCELLED->value,
        ]);

        return $advance->fresh();
    }

    protected function applyFilters($query, array $filters): void
    {
        if (isset($filters['employee_id'])) {
            $query->where('employee_id', $filters['employee_id']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['amount_min'])) {
            $query->where('amount', '>=', $filters['amount_min']);
        }

        if (isset($filters['amount_max'])) {
            $query->where('amount', '<=', $filters['amount_max']);
        }

        if (isset($filters['requested_date_from'])) {
            $query->where('requested_date', '>=', $filters['requested_date_from']);
        }

        if (isset($filters['requested_date_to'])) {
            $query->where('requested_date', '<=', $filters['requested_date_to']);
        }

        if (isset($filters['search'])) {
            $query->whereHas('employee', function ($q) use ($filters) {
                $q->where('first_name', 'like', "%{$filters['search']}%")
                    ->orWhere('last_name', 'like', "%{$filters['search']}%")
                    ->orWhere('identity_no', 'like', "%{$filters['search']}%");
            });
        }
    }
}
