<?php

namespace App\Policies;

use App\Models\Department;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DepartmentPolicy
{
    use HandlesAuthorization;

    /**
     * Bypass all checks for super_admin.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view-departments');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Department $department): bool
    {
        return $user->can('view-departments');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create-departments');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Department $department): bool
    {
        return $user->can('update-departments');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Department $department): bool
    {
        return $user->can('delete-departments');
    }
}
