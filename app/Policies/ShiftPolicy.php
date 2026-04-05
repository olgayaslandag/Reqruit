<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\UserRoleEnum;
use App\Models\Shift;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ShiftPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return in_array($user->rank_id?->value, [UserRoleEnum::ADMIN->value, UserRoleEnum::IK_MANAGER->value]);
    }

    public function view(User $user, Shift $shift): bool
    {
        return in_array($user->rank_id?->value, [UserRoleEnum::ADMIN->value, UserRoleEnum::IK_MANAGER->value]);
    }

    public function create(User $user): bool
    {
        return in_array($user->rank_id?->value, [UserRoleEnum::ADMIN->value, UserRoleEnum::IK_MANAGER->value]);
    }

    public function update(User $user, Shift $shift): bool
    {
        return in_array($user->rank_id?->value, [UserRoleEnum::ADMIN->value, UserRoleEnum::IK_MANAGER->value]);
    }

    public function delete(User $user, Shift $shift): bool
    {
        return $user->rank_id?->value === UserRoleEnum::ADMIN->value;
    }
}
