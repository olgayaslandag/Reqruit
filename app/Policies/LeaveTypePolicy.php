<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\UserRoleEnum;
use App\Models\LeaveType;
use App\Models\User;

class LeaveTypePolicy
{
    private function hasAnyRole(User $user, array $validRoles): bool
    {
        $userEnumValue = $user->rank_id->value ?? $user->rank_id ?? 0;

        $enumToRole = [
            UserRoleEnum::ADMIN->value => 'admin',
            UserRoleEnum::IK_MANAGER->value => 'hr',
            UserRoleEnum::RECRUITER->value => 'employee',
            UserRoleEnum::DEPARTMENT_HEAD->value => 'manager',
            UserRoleEnum::OBSERVER->value => 'observer',
        ];

        $userRoleName = $enumToRole[$userEnumValue] ?? null;

        if ($userRoleName && in_array($userRoleName, $validRoles)) {
            return true;
        }

        foreach ($validRoles as $role) {
            if ($user->hasRole($role)) {
                return true;
            }
        }

        return false;
    }

    public function viewAny(User $user): bool
    {
        return $this->hasAnyRole($user, ['admin', 'hr', 'ik_manager', 'super_admin']);
    }

    public function view(User $user, LeaveType $leaveType): bool
    {
        return $this->hasAnyRole($user, ['admin', 'hr', 'ik_manager', 'super_admin']);
    }

    public function create(User $user): bool
    {
        return $this->hasAnyRole($user, ['admin', 'hr', 'ik_manager', 'super_admin']);
    }

    public function update(User $user, LeaveType $leaveType): bool
    {
        return $this->hasAnyRole($user, ['admin', 'hr', 'ik_manager', 'super_admin']);
    }

    public function delete(User $user, LeaveType $leaveType): bool
    {
        return $this->hasAnyRole($user, ['admin', 'hr', 'ik_manager', 'super_admin']);
    }

    public function restore(User $user, LeaveType $leaveType): bool
    {
        return $this->hasAnyRole($user, ['admin', 'hr', 'ik_manager', 'super_admin']);
    }

    public function forceDelete(User $user, LeaveType $leaveType): bool
    {
        return $this->hasAnyRole($user, ['admin', 'super_admin']);
    }
}
