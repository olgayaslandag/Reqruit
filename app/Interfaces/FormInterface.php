<?php

namespace App\Interfaces;

interface FormInterface
{
    public function getAll(array $filters = []);
    public function getById(int $id);
    public function getBySlug(string $slug);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
    public function getWithFields(int $id);
    public function getWithFieldsBySlug(string $slug);
}
