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
        // If the user is the owner of the submission, they can view it
        if ($this->isSubmissionOwner($user, $submission)) {
            return true;
        }

        // Normal kullanıcıların rasgele submission'ları görmesine izin verme
        return false;
    }

    /**
     * Determines whether user can access files from this submission
     */
    public function viewFile(User $user, Submission $submission): bool
    {
        return $this->view($user, $submission);
    }

    /**
     * Determines whether user can download files from this submission
     */
    public function downloadFile(User $user, Submission $submission): bool
    {
        return $this->view($user, $submission);
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

    /**
     * Check if user is the owner of the submission
     *
     * Since there's no direct relation between User and Submission in the model,
     * we check if any details (like email field) can link the submission to the user.
     */
    protected function isSubmissionOwner(User $user, Submission $submission): bool
    {
        // Try to identify the user in the form submission details to establish ownership
        // This implementation assumes there might be an email field or other identifier in submission details

        $userEmail = $user->email; // Primary identifier from user

        // Search in submission details for a matching identity field
        foreach ($submission->details as $detail) {
            $fieldName = $detail->field_name;
            $fieldValue = $detail->field_value;

            // Check for common identifiers that could link to user
            if (
                ($fieldName === 'email' || $fieldName === 'user_email' || str_contains($fieldName, 'email')) &&
                $fieldValue === $userEmail
            ) {
                return true;
            }
        }

        return false;
    }
}
