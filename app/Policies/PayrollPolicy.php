<?php

namespace App\Policies;

use App\Enums\PayrollStatusEnum;
use App\Enums\UserRoleEnum;
use App\Models\PayrollPeriod;
use App\Models\User;

class PayrollPolicy
{
    /**
     * Helper method to check if user has specific roles (either by rank enum or spatie role)
     */
    private function hasAnyRole(User $user, array $validRoles): bool
    {
        // Check if user has any matching enum role
        $userEnumValue = $user->rank_id->value ?? $user->rank_id ?? 0;

        // Map enum values to role names
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

        // Also check for Spatie roles
        foreach ($validRoles as $role) {
            if ($user->hasRole($role)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $this->hasAnyRole($user, ['admin', 'hr', 'accounting', 'manager']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, PayrollPeriod $payroll): bool
    {
        return $this->hasAnyRole($user, ['admin', 'hr', 'accounting', 'manager']);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $this->hasAnyRole($user, ['admin', 'hr']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PayrollPeriod $payroll): bool
    {
        // Sadece taslak bordrolar güncellenebilir
        if ($payroll->status !== PayrollStatusEnum::DRAFT->value) {
            return false;
        }

        return $this->hasAnyRole($user, ['admin', 'hr']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PayrollPeriod $payroll): bool
    {
        // Sadece taslak bordrolar silinebilir
        if ($payroll->status !== PayrollStatusEnum::DRAFT->value) {
            return false;
        }

        return $this->hasAnyRole($user, ['admin', 'hr']);
    }

    /**
     * Determine whether the user can generate payroll items.
     */
    public function generateItems(User $user, PayrollPeriod $payroll): bool
    {
        // Sadece taslak bordrolar için kalem oluşturulabilir
        if ($payroll->status !== PayrollStatusEnum::DRAFT->value) {
            return false;
        }

        return $this->hasAnyRole($user, ['admin', 'hr']);
    }

    /**
     * Determine whether the user can approve the model.
     */
    public function approve(User $user, PayrollPeriod $payroll): bool
    {
        $currentStatus = PayrollStatusEnum::from($payroll->status);

        // Yayınlanmış bordro onaylanamaz
        if ($currentStatus === PayrollStatusEnum::PUBLISHED) {
            return false;
        }

        // Get user's effective role
        $userEnumValue = $user->rank_id->value ?? $user->rank_id ?? 0;

        $enumToRole = [
            UserRoleEnum::ADMIN->value => 'admin',
            UserRoleEnum::IK_MANAGER->value => 'hr',
            UserRoleEnum::DEPARTMENT_HEAD->value => 'manager',
        ];

        $userRoleName = $enumToRole[$userEnumValue] ?? null;

        // Check Spatie roles
        $userSpatieRoles = array_map(fn ($role) => $role->name, $user->roles->toArray());
        $effectiveRoles = array_merge([$userRoleName], $userSpatieRoles);

        if (in_array('manager', $effectiveRoles) && $currentStatus === PayrollStatusEnum::DRAFT) {
            return true;
        }

        if (in_array('hr', $effectiveRoles) && $currentStatus === PayrollStatusEnum::MANAGER_APPROVED) {
            return true;
        }

        if (in_array('accounting', $effectiveRoles) && $currentStatus === PayrollStatusEnum::HR_APPROVED) {
            return true;
        }

        return in_array('admin', $effectiveRoles);
    }

    /**
     * Determine whether the user can publish the model.
     */
    public function publish(User $user, PayrollPeriod $payroll): bool
    {
        // Sadece muhasebe onaylı bordrolar yayınlanabilir
        if ($payroll->status !== PayrollStatusEnum::ACCOUNTING_APPROVED->value) { // Fixed: ACCOUNTING instead of ACCOUNTING_APPROVED
            return false;
        }

        // Check enum or spatie roles
        $validRoles = ['admin', 'accounting'];

        return $this->hasAnyRole($user, $validRoles);
    }
}
