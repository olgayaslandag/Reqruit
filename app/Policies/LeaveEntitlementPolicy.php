<?php

declare(strict_types=1);
namespace App\Policies;

use App\Models\LeaveEntitlement;
use App\Models\User;

class LeaveEntitlementPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('super_admin') || $user->hasRole('ik_manager') || $user->hasRole('department_head') || $user->hasRole('recruiter');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, LeaveEntitlement $leaveEntitlement): bool
    {
        return $user->hasRole('super_admin') ||
               $user->hasRole('ik_manager') ||
               ($user->hasRole('department_head') && $leaveEntitlement->employee->department_id === $user->employee->department_id) ||
               ($user->hasRole('recruiter') && in_array($user->employee->department_id, $user->assignedDepartments()->pluck('id')->toArray()));
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('super_admin') || $user->hasRole('ik_manager') || $user->hasRole('recruiter');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, LeaveEntitlement $leaveEntitlement): bool
    {
        return $user->hasRole('super_admin') || $user->hasRole('ik_manager');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, LeaveEntitlement $leaveEntitlement): bool
    {
        return $user->hasRole('super_admin') || $user->hasRole('ik_manager');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, LeaveEntitlement $leaveEntitlement): bool
    {
        return $user->hasRole('super_admin') || $user->hasRole('ik_manager');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, LeaveEntitlement $leaveEntitlement): bool
    {
        return $user->hasRole('super_admin');
    }
}
