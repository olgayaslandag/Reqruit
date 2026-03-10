<?php

namespace App\Policies;

use App\Models\Form;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FormPolicy
{
    use HandlesAuthorization;

    /**
     * Allow all actions for authenticated users.
     */
    public function before(User $user, string $ability): ?bool
    {
        return $user ? true : null;
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Form $form): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Form $form): bool
    {
        return true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Form $form): bool
    {
        return true;
    }
}
