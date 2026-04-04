<?php

declare(strict_types=1);
namespace App\Policies;

use App\Models\Submission;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SubmissionPolicy
{
    use HandlesAuthorization;

    /**
     * Grant all abilities to admin and ik_manager roles.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole(['admin', 'ik_manager'])) {
            return true;
        }

        return null;
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
