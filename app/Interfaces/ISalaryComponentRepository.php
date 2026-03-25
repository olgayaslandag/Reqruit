<?php

namespace App\Interfaces;

use App\Models\SalaryComponent;
use Illuminate\Database\Eloquent\Collection;

interface ISalaryComponentRepository
{
    public function getAll(array $filters = [], array $with = []): Collection;

    public function getPaginated(array $filters = [], array $with = [], int $perPage = 15);

    public function getById(int $id, array $with = []): ?SalaryComponent;

    public function create(array $data): SalaryComponent;

    public function update(int $id, array $data): SalaryComponent;

    public function delete(int $id): bool;

    public function getByCode(string $code): ?SalaryComponent;

    public function getActive(): Collection;

    public function getEarnings(): Collection;

    public function getDeductions(): Collection;

    public function getFixed(): Collection;

    public function getVariable(): Collection;
}
