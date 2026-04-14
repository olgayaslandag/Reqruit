<?php

declare(strict_types=1);

namespace App\Services;

use App\Interfaces\IUserRepository;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(
        protected IUserRepository $userRepository,
    ) {}

    public function create(array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        return $this->userRepository->create($data);
    }

    public function update(int $id, array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        return $this->userRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->userRepository->delete($id);
    }

    public function findById(int $id, array $with = []): ?User
    {
        return $this->userRepository->find($id, $with);
    }

    public function findByIdOrFail(int $id, array $with = []): User
    {
        return $this->userRepository->findOrFail($id, $with);
    }

    public function getPaginated(array $filters = [], array $with = [], int $perPage = 15)
    {
        return $this->userRepository->getPaginated($filters, $with, $perPage);
    }

    public function search(string $keyword, array $with = []): array
    {
        $filters = ['search' => $keyword];

        return $this->userRepository->getAll($filters, $with)->toArray();
    }
}
