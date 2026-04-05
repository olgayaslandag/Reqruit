<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\UserRoleEnum;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function before(User $user, string $ability): ?bool
    {
        if (! $user) {
            return false;
        }

        if (in_array($user->rank_id?->value, [UserRoleEnum::ADMIN->value, UserRoleEnum::IK_MANAGER->value])) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return in_array($user->rank_id?->value, [
            UserRoleEnum::ADMIN->value,
            UserRoleEnum::IK_MANAGER->value,
        ]);
    }

    public function view(User $user, User $model): bool
    {
        return in_array($user->rank_id?->value, [
            UserRoleEnum::ADMIN->value,
            UserRoleEnum::IK_MANAGER->value,
        ]);
    }

    public function create(User $user): bool
    {
        return $user->rank_id?->value === UserRoleEnum::ADMIN->value;
    }

    public function update(User $user, User $model): bool
    {
        return $user->rank_id?->value === UserRoleEnum::ADMIN->value;
    }

    public function delete(User $user, User $model): bool
    {
        return $user->rank_id?->value === UserRoleEnum::ADMIN->value;
    }
}
