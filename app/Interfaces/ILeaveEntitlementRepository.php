<?php

declare(strict_types=1);
namespace App\Interfaces;

interface ILeaveEntitlementRepository
{
    public function getAll(array $filters = [], array $with = []);

    public function getPaginated(array $filters = [], array $with = [], int $perPage = 15);

    public function getByEmployeeAndYear(int $employeeId, string $year, array $with = []);

    public function getById(int $id, array $with = []);

    public function create(array $data);

    public function update(int $id, array $data);

    public function delete(int $id);
}
