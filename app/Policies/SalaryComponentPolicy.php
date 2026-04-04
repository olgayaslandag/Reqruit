<?php

declare(strict_types=1);
namespace App\Policies;

use App\Enums\UserRoleEnum;
use App\Models\SalaryComponent;
use App\Models\User;

class SalaryComponentPolicy
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
            UserRoleEnum::DEPARTMENT_HEAD->value => 'manager',
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
    public function view(User $user, SalaryComponent $salaryComponent): bool
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
    public function update(User $user, SalaryComponent $salaryComponent): bool
    {
        return $this->hasAnyRole($user, ['admin', 'hr']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SalaryComponent $salaryComponent): bool
    {
        // Aktif olarak kullanılan kalemler silinemez
        if ($salaryComponent->employeeSalaries()->count() > 0) {
            return false;
        }

        return $this->hasAnyRole($user, ['admin', 'hr']);
    }
}
