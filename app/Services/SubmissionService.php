<?php

declare(strict_types=1);

namespace App\Services;

use App\Interfaces\IFormRepository;
use App\Interfaces\ISubmissionRepository;
use App\Jobs\SendSubmissionNotification;
use App\Models\Submission;
use App\Models\SubmissionComment;
use Illuminate\Support\Facades\Gate;

class SubmissionService
{
    public function __construct(
        protected ISubmissionRepository $submissionRepository,
        protected IFormRepository $formRepository
    ) {}

    /**
     * Get submissions with optional limit/offset.
     *
     * WARNING: Calling without limit loads all records into memory.
     * Use getCursorPaginated() or getPaginated() for large datasets.
     */
    public function getAll(array $filters = [], ?int $limit = null, int $offset = 0)
    {
        return $this->submissionRepository->getAll($filters, $limit, $offset);
    }

    /**
     * Get paginated submissions using offset-based pagination.
     */
    public function getPaginated(array $filters = [], int $perPage = 15)
    {
        return $this->submissionRepository->getPaginated($filters, $perPage);
    }

    /**
     * Get cursor-paginated submissions for memory-efficient large dataset handling.
     *
     * @param  array  $filters  Filter options
     * @param  int  $perPage  Items per page
     * @param  string|null  $cursor  Encoded cursor for next page
     * @return array Contains 'items' (Collection), 'next_cursor' (string|null), 'has_more' (bool)
     */
    public function getCursorPaginated(array $filters = [], int $perPage = 15, ?string $cursor = null): array
    {
        return $this->submissionRepository->getCursorPaginated($filters, $perPage, $cursor);
    }

    public function getById(int $id)
    {
        $submission = $this->submissionRepository->getWithDetails($id);

        // Check using policy if the user can view the submission
        Gate::authorize('view', $submission); // This will throw an exception if unauthorized

        // Filter details based on user's permissions
        $submission->details = $this->filterFileDetailsForUser($submission->details, $submission);

        return $submission;
    }

    public function getByReferenceNo(string $referenceNo)
    {
        return $this->submissionRepository->getByReferenceNo($referenceNo);
    }

    public function getWithDetails(int $id)
    {
        $submission = $this->submissionRepository->getWithDetails($id);

        // Authorize access to submission using policy
        Gate::authorize('view', $submission); // This will throw an exception if unauthorized

        // Filter details based on user's file access permissions
        $submission->details = $this->filterFileDetailsForUser($submission->details, $submission);

        return $submission;
    }

    public function handleSubmission(string $formSlug, array $data, array $files = [])
    {
        return \DB::transaction(function () use ($formSlug, $data, $files) {
            $form = $this->formRepository->getBySlug($formSlug);

            // Handle file uploads - secure storage with local disk
            $uploadedFiles = [];
            foreach ($files as $key => $file) {
                if ($file && $file->isValid()) {
                    // Store in local disk (private) - not publicly accessible
                    $path = $file->store('submissions/'.$form->id, 'local');
                    // Store only the path, not a public URL
                    // Signed URLs will be generated via FileController
                    $uploadedFiles[$key] = $path;
                }
            }

            // Merge uploaded files with form data
            $data = array_merge($data, $uploadedFiles);

            // Prepare details
            $details = [];
            $labels = $data['labels'] ?? [];

            // Get form fields to map field labels when not provided via $labels
            $formFields = $form->fields->keyBy('name');

            foreach ($data as $key => $value) {
                if (in_array($key, ['_token', 'labels'])) {
                    continue;
                }

                $formField = $formFields[$key] ?? null;
                $details[] = [
                    'field_name' => $key,
                    'field_label' => $labels[$key] ?? ($formField ? $formField->label : $key),
                    'field_value' => is_array($value) ? implode(', ', $value) : $value,
                ];
            }

            // Create submission
            $submission = $this->submissionRepository->create([
                'form_id' => $form->id,
                'details' => $details,
            ]);

            // Dispatch notification job to queue (async)
            SendSubmissionNotification::dispatch($form, $submission);

            return $submission;
        });
    }

    public function updateStatus(int $id, string $status)
    {
        return $this->submissionRepository->updateStatus($id, $status);
    }

    public function updateInvestigation(int $id, string $investigation, ?string $notes = null)
    {
        return $this->submissionRepository->updateInvestigation($id, $investigation, $notes);
    }
    
    /**
     * Create a new intelligence report for a submission
     */
    public function createIntelligenceReport(int $submissionId, string $status, ?string $notes = null, ?\DateTime $date = null, ?int $userId = null)
    {
        return $this->submissionRepository->createIntelligenceReport($submissionId, $status, $notes, $date, $userId);
    }

    public function addComment(int $submissionId, array $data, ?int $userId = null)
    {
        return \DB::transaction(function () use ($submissionId, $data, $userId) {
            $submission = $this->submissionRepository->getById($submissionId);

            $comment = SubmissionComment::create([
                'submission_id' => $submissionId,
                'user_id' => $userId,
                'comment' => $data['comment'],
                'rating' => $data['rating'] ?? null,
                'is_private' => $data['is_private'] ?? true,
            ]);

            return $comment->load('user');
        });
    }

    public function delete(int $id)
    {
        return $this->submissionRepository->delete($id);
    }

    /**
     * Filters submission details based on user permissions, showing files only for authorized users
     * and restricting file-related properties.
     */
    private function filterFileDetailsForUser($details, Submission $submission)
    {
        // Check with policy if user can view files in this submission
        $canViewFiles = Gate::allows('viewFile', $submission);

        return $details->map(function ($detail) use ($canViewFiles) {
            $isFile = $detail->isFile();

            // Only add file-specific attributes if the user has permission to see files
            if ($canViewFiles && $isFile) {
                $detail->is_file = $isFile;
                $detail->file_url = $detail->getFileUrlAttribute();
                $detail->download_url = $detail->getDownloadUrlAttribute();
                $detail->file_extension = $detail->getFileExtensionAttribute();
                $detail->file_name = $detail->getFileNameAttribute();
            } else {
                // Add minimal information if user doesn't have file rights, or for non-file details
                $detail->is_file = $isFile;

                // Hide URLs for users without permissions
                if ($isFile) {
                    $detail->file_url = null;
                    $detail->download_url = null;
                    $detail->file_extension = $detail->getFileExtensionAttribute();
                    $detail->file_name = $detail->getFileNameAttribute();
                }
            }

            // Ensure the detail object can be accessed securely
            return $detail;
        });
    }
}
