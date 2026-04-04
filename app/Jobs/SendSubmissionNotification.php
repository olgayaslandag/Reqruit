<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Mail\ApplicantThankYouMailable;
use App\Mail\NewSubmissionMailable;
use App\Models\Form;
use App\Models\Submission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendSubmissionNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The maximum number of seconds the job can run.
     */
    public int $timeout = 120;

    /**
     * Create a new job instance.
     */
    public function __construct(
        protected Form $form,
        protected Submission $submission
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // 1. Send notification to department
        $this->sendDepartmentNotification();

        // 2. Send thank you email to applicant
        $this->sendApplicantThankYouEmail();
    }

    /**
     * Send notification to department emails.
     */
    protected function sendDepartmentNotification(): void
    {
        $recipients = $this->getRecipients();

        if (empty($recipients)) {
            Log::info('No recipients found for submission notification', [
                'form_id' => $this->form->id,
                'submission_id' => $this->submission->id,
            ]);

            return;
        }

        try {
            Mail::to($recipients)->send(new NewSubmissionMailable($this->submission));

            Log::info('Department notification sent', [
                'recipients' => $recipients,
                'submission_id' => $this->submission->id,
            ]);
        } catch (\Throwable $e) {
            Log::error('Failed to send department notification', [
                'error' => $e->getMessage(),
                'submission_id' => $this->submission->id,
            ]);
        }
    }

    /**
     * Send thank you email to applicant.
     */
    protected function sendApplicantThankYouEmail(): void
    {
        // Find applicant's email from submission details
        $applicantEmail = $this->getApplicantEmail();

        if (empty($applicantEmail)) {
            Log::info('No applicant email found for thank you email', [
                'submission_id' => $this->submission->id,
            ]);

            return;
        }

        try {
            Mail::to($applicantEmail)->send(
                new ApplicantThankYouMailable($this->submission, $applicantEmail)
            );

            Log::info('Applicant thank you email sent', [
                'email' => $applicantEmail,
                'submission_id' => $this->submission->id,
            ]);
        } catch (\Throwable $e) {
            Log::error('Failed to send applicant thank you email', [
                'error' => $e->getMessage(),
                'submission_id' => $this->submission->id,
            ]);
        }
    }

    /**
     * Get the notification recipients (department/form emails).
     */
    protected function getRecipients(): array
    {
        $recipients = [];

        // Form notification_emails öncelikli
        if (! empty($this->form->notification_emails)) {
            $recipients = array_merge($recipients, $this->form->notification_emails);
        }
        // Sonra department emails
        elseif (! empty($this->form->department?->emails)) {
            $emails = $this->form->department->emails;
            $recipients = array_merge($recipients, is_array($emails) ? $emails : [$emails]);
        }

        // Remove duplicates and empty values
        return array_unique(array_filter($recipients));
    }

    /**
     * Get applicant's email from submission details.
     */
    protected function getApplicantEmail(): ?string
    {
        // Common field names for email
        $emailFields = ['email', 'eposta', 'mail', 'e-posta', 'email_address'];

        foreach ($this->submission->details as $detail) {
            if (in_array(strtolower($detail->field_name), $emailFields)) {
                return $detail->field_value;
            }
        }

        return null;
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('SendSubmissionNotification job failed', [
            'form_id' => $this->form->id,
            'submission_id' => $this->submission->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
