<?php

namespace App\Policies;

use App\Models\Submission;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SubmissionPolicy
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
        return $user->can('view-applications');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Submission $submission): bool
    {
        return $user->can('view-applications');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create-applications');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Submission $submission): bool
    {
        return $user->can('update-applications');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Submission $submission): bool
    {
        return $user->can('delete-applications');
    }

    /**
     * Determine whether the user can review submissions.
     */
    public function review(User $user, Submission $submission): bool
    {
        return $user->can('review-applications');
    }

    /**
     * Determine whether the user can add comments.
     */
    public function addComment(User $user, Submission $submission): bool
    {
        return $user->can('add-comments');
    }
}
