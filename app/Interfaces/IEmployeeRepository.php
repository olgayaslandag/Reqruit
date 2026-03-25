<?php

namespace App\Interfaces;

interface IEmployeeRepository
{
    public function getAll(array $filters = [], array $with = []);

    public function getPaginated(array $filters = [], array $with = [], int $perPage = 15);

    public function getById(int $id, array $with = []);

    public function create(array $data);

    public function update(int $id, array $data);

    public function delete(int $id);

    public function getByIdentityNo(string $identityNo);

    public function search(string $keyword, array $with = []);

    public function getTree();
}
