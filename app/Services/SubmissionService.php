<?php

namespace App\Services;

use App\Interfaces\FormInterface;
use App\Interfaces\SubmissionInterface;
use App\Jobs\SendSubmissionNotification;
use App\Models\SubmissionComment;

class SubmissionService
{
    public function __construct(
        protected SubmissionInterface $submissionRepository,
        protected FormInterface $formRepository
    ) {}

    public function getAll(array $filters = [])
    {
        return $this->submissionRepository->getAll($filters);
    }

    public function getById(int $id)
    {
        return $this->submissionRepository->getWithDetails($id);
    }

    public function getByReferenceNo(string $referenceNo)
    {
        return $this->submissionRepository->getByReferenceNo($referenceNo);
    }

    public function handleSubmission(string $formSlug, array $data, array $files = [])
    {
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

        foreach ($data as $key => $value) {
            if (in_array($key, ['_token', 'labels'])) {
                continue;
            }

            $details[] = [
                'field_name' => $key,
                'field_label' => $labels[$key] ?? $key,
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
    }

    public function updateStatus(int $id, string $status)
    {
        return $this->submissionRepository->updateStatus($id, $status);
    }

    public function updateInvestigation(int $id, string $investigation)
    {
        return $this->submissionRepository->updateInvestigation($id, $investigation);
    }

    public function addComment(int $submissionId, array $data, ?int $userId = null)
    {
        $submission = $this->submissionRepository->getById($submissionId);

        $comment = SubmissionComment::create([
            'submission_id' => $submissionId,
            'user_id' => $userId,
            'comment' => $data['comment'],
            'rating' => $data['rating'] ?? null,
            'is_private' => $data['is_private'] ?? true,
        ]);

        return $comment->load('user');
    }

    public function delete(int $id)
    {
        return $this->submissionRepository->delete($id);
    }
}
