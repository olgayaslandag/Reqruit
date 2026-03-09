<?php

namespace App\Interfaces;

interface SubmissionInterface
{
    public function getAll(array $filters = []);
    public function getById(int $id);
    public function getByReferenceNo(string $referenceNo);
    public function create(array $data);
    public function update(int $id, array $data);
    public function updateStatus(int $id, string $status);
    public function delete(int $id);
    public function getWithDetails(int $id);
}
