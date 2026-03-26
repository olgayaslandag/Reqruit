<?php

namespace App\Policies;

use App\Enums\UserRoleEnum;
use App\Models\AttendanceAdjustment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AdjustmentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return in_array($user->rank_id, [UserRoleEnum::ADMIN->value, UserRoleEnum::IK_MANAGER->value]);
    }

    public function view(User $user, AttendanceAdjustment $adjustment): bool
    {
        if ($adjustment->requested_by === $user->id) {
            return true;
        }

        return in_array($user->rank_id, [UserRoleEnum::ADMIN->value, UserRoleEnum::IK_MANAGER->value]);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, AttendanceAdjustment $adjustment): bool
    {
        return in_array($user->rank_id, [UserRoleEnum::ADMIN->value, UserRoleEnum::IK_MANAGER->value]);
    }

    public function delete(User $user, AttendanceAdjustment $adjustment): bool
    {
        if ($adjustment->status !== 'pending') {
            return false;
        }

        return ($adjustment->requested_by === $user->id) ||
               in_array($user->rank_id, [UserRoleEnum::ADMIN->value, UserRoleEnum::IK_MANAGER->value]);
    }

    public function approve(User $user, AttendanceAdjustment $adjustment): bool
    {
        return in_array($user->rank_id, [UserRoleEnum::ADMIN->value, UserRoleEnum::IK_MANAGER->value]);
    }

    public function reject(User $user, AttendanceAdjustment $adjustment): bool
    {
        return in_array($user->rank_id, [UserRoleEnum::ADMIN->value, UserRoleEnum::IK_MANAGER->value]);
    }

    public function updateOwn(User $user, AttendanceAdjustment $adjustment): bool
    {
        return $adjustment->requested_by === $user->id &&
               $adjustment->status === 'pending';
    }
}
