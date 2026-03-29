<?php

namespace App\Interfaces;

interface ILeaveEntitlementRepository
{
    public function getAll(array $filters = [], array $with = []);

    public function getByEmployeeAndYear(int $employeeId, string $year, array $with = []);

    public function getById(int $id, array $with = []);

    public function create(array $data);

    public function update(int $id, array $data);

    public function delete(int $id);
}
