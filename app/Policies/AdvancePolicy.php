<?php

declare(strict_types=1);
namespace App\Policies;

use App\Enums\AdvanceStatusEnum;
use App\Enums\UserRoleEnum;
use App\Models\AdvanceRequest;
use App\Models\User;

class AdvancePolicy
{
    /**
     * Helper method to check if user has specific roles (either by rank enum or spatie role)
     */
    private function hasAnyRole(User $user, array $validRoles): bool
    {
        // Check if user has any matching enum role
        $userEnumValue = $user->rank_id->value ?? $user->rank_id ?? 0;

        // Full mapping like PayrollPolicy
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
    public function view(User $user, AdvanceRequest $advance): bool
    {
        // Kullanıcı kendi avansını veya yönetici/HR/Accounting görebilir
        if ($user->id === $advance->employee->user_id) {
            return true;
        }

        return $this->hasAnyRole($user, ['admin', 'hr', 'accounting', 'manager']);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $this->hasAnyRole($user, ['admin', 'hr', 'employee']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, AdvanceRequest $advance): bool
    {
        // Sadece bekleyen talepler güncellenebilir
        if ($advance->status !== AdvanceStatusEnum::PENDING->value) {
            return false;
        }

        // Kullanıcı kendi talebini güncelleyebilir veya HR/Admin
        if ($user->id === $advance->employee->user_id) {
            return true;
        }

        return $this->hasAnyRole($user, ['admin', 'hr']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, AdvanceRequest $advance): bool
    {
        // Sadece bekleyen talepler silinebilir
        if ($advance->status !== AdvanceStatusEnum::PENDING->value) {
            return false;
        }

        // Kullanıcı kendi talebini silebilir veya HR/Admin
        if ($user->id === $advance->employee->user_id) {
            return true;
        }

        return $this->hasAnyRole($user, ['admin', 'hr']);
    }

    /**
     * Determine whether the user can approve the model.
     */
    public function approve(User $user, AdvanceRequest $advance): bool
    {
        // Sadece bekleyen talepler onaylanabilir
        if ($advance->status !== AdvanceStatusEnum::PENDING->value) {
            return false;
        }

        return $this->hasAnyRole($user, ['admin', 'hr', 'manager', 'accounting']);
    }

    /**
     * Determine whether the user can reject the model.
     */
    public function reject(User $user, AdvanceRequest $advance): bool
    {
        // Sadece bekleyen talepler reddedilebilir
        if ($advance->status !== AdvanceStatusEnum::PENDING->value) {
            return false;
        }

        return $this->hasAnyRole($user, ['admin', 'hr', 'manager', 'accounting']);
    }

    /**
     * Determine whether the user can mark as paid.
     */
    public function markAsPaid(User $user, AdvanceRequest $advance): bool
    {
        // Sadece onaylanmış talepler ödenebilir
        if ($advance->status !== AdvanceStatusEnum::APPROVED->value) {
            return false;
        }

        return $this->hasAnyRole($user, ['admin', 'accounting']);
    }

    /**
     * Determine whether the user can cancel the model.
     */
    public function cancel(User $user, AdvanceRequest $advance): bool
    {
        // Sadece bekleyen veya onaylanmış talepler iptal edilebilir
        if (! in_array($advance->status, [
            AdvanceStatusEnum::PENDING->value,
            AdvanceStatusEnum::APPROVED->value,
        ])) {
            return false;
        }

        // Kullanıcı kendi talebini iptal edebilir veya HR/Admin
        if ($user->id === $advance->employee->user_id) {
            return true;
        }

        return $this->hasAnyRole($user, ['admin', 'hr']);
    }
}
