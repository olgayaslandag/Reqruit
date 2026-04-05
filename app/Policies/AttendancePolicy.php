<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\UserRoleEnum;
use App\Models\AttendanceRecord;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AttendancePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return in_array($user->rank_id?->value, [UserRoleEnum::ADMIN->value, UserRoleEnum::IK_MANAGER->value]);
    }

    public function view(User $user, AttendanceRecord $attendance): bool
    {
        if ($attendance->employee->user_id === $user->id) {
            return true;
        }

        return in_array($user->rank_id?->value, [UserRoleEnum::ADMIN->value, UserRoleEnum::IK_MANAGER->value]);
    }

    public function create(User $user): bool
    {
        return in_array($user->rank_id?->value, [UserRoleEnum::ADMIN->value, UserRoleEnum::IK_MANAGER->value]);
    }

    public function update(User $user, AttendanceRecord $attendance): bool
    {
        return in_array($user->rank_id?->value, [UserRoleEnum::ADMIN->value, UserRoleEnum::IK_MANAGER->value]);
    }

    public function delete(User $user, AttendanceRecord $attendance): bool
    {
        return in_array($user->rank_id?->value, [UserRoleEnum::ADMIN->value, UserRoleEnum::IK_MANAGER->value]);
    }

    public function clockIn(User $user): bool
    {
        return true;
    }

    public function clockOut(User $user): bool
    {
        return true;
    }

    public function manageOwnAttendance(User $user, AttendanceRecord $attendance): bool
    {
        return $attendance->employee->user_id === $user->id;
    }
}
