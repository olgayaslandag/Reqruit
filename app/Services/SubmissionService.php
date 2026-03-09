<?php

namespace App\Services;

use App\Interfaces\FormInterface;
use App\Interfaces\SubmissionInterface;
use App\Models\SubmissionComment;
use Illuminate\Support\Facades\Mail;

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

        // Handle file uploads
        $uploadedFiles = [];
        foreach ($files as $key => $file) {
            if ($file && $file->isValid()) {
                $path = $file->store('submissions/'.$form->id, 'public');
                $uploadedFiles[$key] = asset('storage/'.$path);
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

        // Send notification email
        $this->sendNotificationEmail($form, $submission);

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

    protected function sendNotificationEmail($form, $submission)
    {
        $recipients = [];

        // Add department emails
        $department = $form->department;
        if ($department && ! empty($department->emails)) {
            $deptEmails = is_array($department->emails)
                ? $department->emails
                : [$department->emails];
            $recipients = array_merge($recipients, $deptEmails);
        }

        // Add form-specific notification emails
        if (! empty($form->notification_emails)) {
            $recipients = array_merge($recipients, $form->notification_emails);
        }

        // Remove duplicates and empty values
        $recipients = array_unique(array_filter($recipients));

        if (empty($recipients)) {
            return;
        }

        $body = "Yeni bir başvuru alındı:\n\n";
        $body .= "Form: {$form->name}\n";
        $body .= "Referans No: {$submission->reference_no}\n";
        $body .= "Tarih: {$submission->created_at}\n\n";

        foreach ($submission->details as $detail) {
            $body .= "{$detail->field_label}: {$detail->field_value}\n";
        }

        // Note: In production, use proper Mail facade
        // Mail::raw($body, function ($message) use ($recipients) {
        //     $message->to($recipients)->subject('Yeni Başvuru');
        // });
    }
}
