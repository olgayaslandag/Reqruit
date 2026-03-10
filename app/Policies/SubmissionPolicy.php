<?php

namespace App\Policies;

use App\Models\Submission;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SubmissionPolicy
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
    public function view(User $user, Submission $submission): bool
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
    public function update(User $user, Submission $submission): bool
    {
        return true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Submission $submission): bool
    {
        return true;
    }

    /**
     * Determine whether the user can review submissions.
     */
    public function review(User $user, Submission $submission): bool
    {
        return true;
    }

    /**
     * Determine whether the user can add comments.
     */
    public function addComment(User $user, Submission $submission): bool
    {
        return true;
    }
}
