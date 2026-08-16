<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\UserRoleEnum;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\User;

class LeaveRequestPolicy
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

    public function viewAny(User $user): bool
    {
        return $this->hasAnyRole($user, ['admin', 'hr', 'manager', 'employee', 'observer', 'super_admin', 'ik_manager', 'department_head', 'recruiter']);
    }

    public function view(User $user, LeaveRequest $leaveRequest): bool
    {
        if ($this->hasAnyRole($user, ['admin', 'hr', 'observer', 'super_admin', 'ik_manager'])) {
            return true;
        }

        $userEmployee = $this->resolveEmployee($user);

        if ($userEmployee && $leaveRequest->employee_id === $userEmployee->id) {
            return true;
        }

        if ($this->hasAnyRole($user, ['manager', 'department_head'])
            && $leaveRequest->employee?->department_id
            && $leaveRequest->employee->department_id === $userEmployee?->department_id) {
            return true;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, LeaveRequest $leaveRequest): bool
    {
        if ($leaveRequest->status !== 'pending') {
            return false;
        }

        $userEmployee = $this->resolveEmployee($user);

        if ($userEmployee && $leaveRequest->employee_id === $userEmployee->id) {
            return true;
        }

        return $this->hasAnyRole($user, ['admin', 'hr', 'super_admin', 'ik_manager']);
    }

    public function delete(User $user, LeaveRequest $leaveRequest): bool
    {
        if ($leaveRequest->status !== 'pending') {
            return false;
        }

        $userEmployee = $this->resolveEmployee($user);

        if ($userEmployee && $leaveRequest->employee_id === $userEmployee->id) {
            return true;
        }

        return $this->hasAnyRole($user, ['admin', 'hr', 'super_admin', 'ik_manager']);
    }

    public function approve(User $user, LeaveRequest $leaveRequest): bool
    {
        if ($this->hasAnyRole($user, ['admin', 'hr', 'super_admin', 'ik_manager'])) {
            return true;
        }

        $userEmployee = $this->resolveEmployee($user);

        if ($this->hasAnyRole($user, ['manager', 'department_head'])
            && $leaveRequest->employee?->department_id
            && $leaveRequest->employee->department_id === $userEmployee?->department_id) {
            return true;
        }

        return $this->hasAnyRole($user, ['employee', 'recruiter']);
    }

    public function restore(User $user, LeaveRequest $leaveRequest): bool
    {
        return $this->hasAnyRole($user, ['admin', 'hr', 'super_admin', 'ik_manager']);
    }

    public function forceDelete(User $user, LeaveRequest $leaveRequest): bool
    {
        return $this->hasAnyRole($user, ['admin', 'super_admin']);
    }
}
