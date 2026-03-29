<?php

namespace App\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface IFormRepository
{
    public function getAll(array $filters = []): Collection;

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function getById(int $id);

    public function getBySlug(string $slug);

    public function create(array $data);

    public function update(int $id, array $data);

    public function delete(int $id);

    public function getWithFields(int $id);

    public function getWithFieldsBySlug(string $slug);
}
