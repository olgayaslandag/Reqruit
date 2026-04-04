<?php

declare(strict_types=1);
namespace App\Policies;

use App\Enums\UserRoleEnum;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EmployeePolicy
{
    use HandlesAuthorization;

    /**
     * Sadece yetkili kullanıcılar erişim sağlayabilir.
     */
    public function before(User $user, string $ability): ?bool
    {
        if (! $user) {
            return false;
        }

        // Admin ve IK_Manager tüm işlemleri yapabilir
        if (in_array($user->rank_id?->value, [UserRoleEnum::ADMIN->value, UserRoleEnum::IK_MANAGER->value])) {
            return true;
        }

        // Diğer rollere göre yetkilendirme
        return match ($ability) {
            'view', 'viewAny' => in_array($user->rank_id?->value, [
                UserRoleEnum::DEPARTMENT_HEAD->value,
                UserRoleEnum::OBSERVER->value,
            ]),
            default => false,
        };
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->rank_id?->value, [
            UserRoleEnum::ADMIN->value,
            UserRoleEnum::IK_MANAGER->value,
            UserRoleEnum::DEPARTMENT_HEAD->value,
            UserRoleEnum::OBSERVER->value,
        ]);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Employee $employee): bool
    {
        return in_array($user->rank_id?->value, [
            UserRoleEnum::ADMIN->value,
            UserRoleEnum::IK_MANAGER->value,
            UserRoleEnum::DEPARTMENT_HEAD->value,
            UserRoleEnum::OBSERVER->value,
        ]);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return in_array($user->rank_id?->value, [
            UserRoleEnum::ADMIN->value,
            UserRoleEnum::IK_MANAGER->value,
        ]);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Employee $employee): bool
    {
        return in_array($user->rank_id?->value, [
            UserRoleEnum::ADMIN->value,
            UserRoleEnum::IK_MANAGER->value,
        ]);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Employee $employee): bool
    {
        return in_array($user->rank_id?->value, [
            UserRoleEnum::ADMIN->value,
            UserRoleEnum::IK_MANAGER->value,
        ]);
    }

    /**
     * Determine whether the user can upload documents.
     */
    public function uploadDocument(User $user, Employee $employee): bool
    {
        return in_array($user->rank_id?->value, [
            UserRoleEnum::ADMIN->value,
            UserRoleEnum::IK_MANAGER->value,
        ]);
    }

    /**
     * Determine whether the user can delete documents.
     */
    public function deleteDocument(User $user, Employee $employee): bool
    {
        return in_array($user->rank_id?->value, [
            UserRoleEnum::ADMIN->value,
            UserRoleEnum::IK_MANAGER->value,
        ]);
    }

    /**
     * Determine whether the user can add position history.
     */
    public function addPosition(User $user, Employee $employee): bool
    {
        return in_array($user->rank_id?->value, [
            UserRoleEnum::ADMIN->value,
            UserRoleEnum::IK_MANAGER->value,
        ]);
    }

    /**
     * Determine whether the user can terminate employee.
     */
    public function terminate(User $user, Employee $employee): bool
    {
        return in_array($user->rank_id?->value, [
            UserRoleEnum::ADMIN->value,
            UserRoleEnum::IK_MANAGER->value,
        ]);
    }

    /**
     * Determine whether the user can clock for an employee.
     */
    public function clock(User $user, Employee $employee): bool
    {
        // If the user is the employee themselves, they can clock in/out
        if ($user->employee && $user->employee->id === $employee->id) {
            return true;
        }

        // Admin and IK Manager can clock for any employee
        if (in_array($user->rank_id?->value, [
            UserRoleEnum::ADMIN->value,
            UserRoleEnum::IK_MANAGER->value,
        ])) {
            return true;
        }

        return false;
    }
}
