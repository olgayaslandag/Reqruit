<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\UserRoleEnum;
use App\Models\Employee;
use App\Models\LeaveEntitlement;
use App\Models\User;

class LeaveEntitlementPolicy
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
        return $this->hasAnyRole($user, ['admin', 'hr', 'manager', 'employee', 'super_admin', 'ik_manager', 'department_head', 'recruiter']);
    }

    /**
     * Kullanıcıyı e-posta adresi üzerinden çalışan kaydıyla eşleştirir.
     */
    private function resolveEmployee(User $user): ?Employee
    {
        if (! $user->email) {
            return null;
        }

        return Employee::where('email', $user->email)->first();
    }

    public function view(User $user, LeaveEntitlement $leaveEntitlement): bool
    {
        if ($this->hasAnyRole($user, ['admin', 'hr', 'super_admin', 'ik_manager'])) {
            return true;
        }

        $userEmployee = $this->resolveEmployee($user);

        return $this->hasAnyRole($user, ['manager', 'department_head'])
            && $leaveEntitlement->employee?->department_id
            && $leaveEntitlement->employee->department_id === $userEmployee?->department_id;
    }

    public function create(User $user): bool
    {
        return $this->hasAnyRole($user, ['admin', 'hr', 'employee', 'super_admin', 'ik_manager', 'recruiter']);
    }

    public function update(User $user, LeaveEntitlement $leaveEntitlement): bool
    {
        return $this->hasAnyRole($user, ['admin', 'hr', 'super_admin', 'ik_manager']);
    }

    public function delete(User $user, LeaveEntitlement $leaveEntitlement): bool
    {
        return $this->hasAnyRole($user, ['admin', 'hr', 'super_admin', 'ik_manager']);
    }

    public function restore(User $user, LeaveEntitlement $leaveEntitlement): bool
    {
        return $this->hasAnyRole($user, ['admin', 'hr', 'super_admin', 'ik_manager']);
    }

    public function forceDelete(User $user, LeaveEntitlement $leaveEntitlement): bool
    {
        return $this->hasAnyRole($user, ['admin', 'super_admin']);
    }
}
