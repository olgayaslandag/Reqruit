<?php

namespace App\Interfaces;

interface DepartmentInterface
{
    public function getAll(array $filters = []);
    public function getById(int $id);
    public function getBySlug(string $slug);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
    public function getTree();
}
