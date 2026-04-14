<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\UserRoleEnum;
use App\Models\User;

class PayrollReportPolicy
{
    /**
     * Determine whether the user can view payroll reports.
     */
    public function viewAny(User $user): bool
    {
        return $user->rank_id === UserRoleEnum::ADMIN ||
               $user->rank_id === UserRoleEnum::IK_MANAGER ||
               $user->rank_id === UserRoleEnum::DEPARTMENT_HEAD ||
               $this->hasSpatieRole($user, ['accounting', 'manager', 'hr']);
    }

    /**
     * Helper method to check for Spatie role.
     */
    private function hasSpatieRole(User $user, array $roles): bool
    {
        foreach ($roles as $role) {
            if ($user->hasRole($role)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Determine whether the user can view specific payroll reports.
     */
    public function view(User $user): bool
    {
        return $user->rank_id === UserRoleEnum::ADMIN ||
               $user->rank_id === UserRoleEnum::IK_MANAGER ||
               $user->rank_id === UserRoleEnum::DEPARTMENT_HEAD ||
               $this->hasSpatieRole($user, ['accounting', 'manager', 'hr']);
    }

    /**
     * Determine whether the user can generate reports.
     */
    public function generate(User $user): bool
    {
        return $user->rank_id === UserRoleEnum::ADMIN ||
               $user->rank_id === UserRoleEnum::IK_MANAGER ||
               $this->hasSpatieRole($user, ['accounting', 'hr']);
    }
}
