<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\LeaveRequest;
use App\Models\User;

class LeaveRequestPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('super_admin') || $user->hasRole('ik_manager') || $user->hasRole('department_head') || $user->hasRole('recruiter') || $user->hasRole('observer');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, LeaveRequest $leaveRequest): bool
    {
        return $user->hasRole('super_admin') ||
               $user->hasRole('ik_manager') ||
               $user->id === $leaveRequest->employee_id ||
               ($user->hasRole('department_head') && $leaveRequest->employee->department_id === $user->employee->department_id) ||
               ($user->hasRole('recruiter') && in_array($user->employee->department_id, $user->assignedDepartments()->pluck('id')->toArray())) ||
               $user->hasRole('observer');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Her kullanıcı kendi izin talebini oluşturabilir
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, LeaveRequest $leaveRequest): bool
    {
        // Sadece pending olan talepler güncellenebilir
        if ($leaveRequest->status !== 'pending') {
            return false;
        }

        // Talebi oluşturan kullanıcı kendi talebini güncelleyebilir
        if ($user->id === $leaveRequest->employee_id) {
            return true;
        }

        // Yönetici veya İK rolleri izin talebini güncelleyebilir
        return $user->hasRole('super_admin') || $user->hasRole('ik_manager');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, LeaveRequest $leaveRequest): bool
    {
        // Sadece pending olan talepler silinebilir
        if ($leaveRequest->status !== 'pending') {
            return false;
        }

        // Talebi oluşturan kullanıcı kendi talebini silebilir
        if ($user->id === $leaveRequest->employee_id) {
            return true;
        }

        // Yönetici veya İK rolleri izin talebini silebilir
        return $user->hasRole('super_admin') || $user->hasRole('ik_manager');
    }

    /**
     * Determine whether the user can approve/reject the model.
     */
    public function approve(User $user, LeaveRequest $leaveRequest): bool
    {
        // Yönetici veya İK rolleri izin talebini onaylayabilir
        return $user->hasRole('super_admin') ||
               $user->hasRole('ik_manager') ||
               ($user->hasRole('department_head') && $leaveRequest->employee->department_id === $user->employee->department_id) ||
               ($user->hasRole('recruiter') && in_array($user->employee->department_id, $user->assignedDepartments()->pluck('id')->toArray()));
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, LeaveRequest $leaveRequest): bool
    {
        return $user->hasRole('super_admin') || $user->hasRole('ik_manager');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, LeaveRequest $leaveRequest): bool
    {
        return $user->hasRole('super_admin');
    }
}
