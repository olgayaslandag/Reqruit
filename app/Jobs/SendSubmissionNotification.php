<?php

namespace App\Jobs;

use App\Models\Form;
use App\Models\Submission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Mail\Message;
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
    public int $timeout = 60;

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
        $recipients = $this->getRecipients();

        if (empty($recipients)) {
            return;
        }

        $subject = __('messages.new_submission_subject', ['form' => $this->form->name]);
        $body = $this->buildEmailBody();

        Mail::raw($body, function (Message $message) use ($recipients, $subject) {
            $message->to($recipients)
                ->subject($subject);
        });
    }

    /**
     * Get the notification recipients.
     */
    protected function getRecipients(): array
    {
        $recipients = [];

        // Add department emails
        $department = $this->form->department;
        if ($department && ! empty($department->emails)) {
            $deptEmails = is_array($department->emails)
                ? $department->emails
                : [$department->emails];
            $recipients = array_merge($recipients, $deptEmails);
        }

        // Add form-specific notification emails
        if (! empty($this->form->notification_emails)) {
            $recipients = array_merge($recipients, $this->form->notification_emails);
        }

        // Remove duplicates and empty values
        return array_unique(array_filter($recipients));
    }

    /**
     * Build the email body.
     */
    protected function buildEmailBody(): string
    {
        $body = __('messages.new_submission_intro')."\n\n";
        $body .= __('messages.form_label').": {$this->form->name}\n";
        $body .= __('messages.reference_no').": {$this->submission->reference_no}\n";
        $body .= __('messages.date_label').": {$this->submission->created_at}\n\n";

        foreach ($this->submission->details as $detail) {
            $body .= "{$detail->field_label}: {$detail->field_value}\n";
        }

        return $body;
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
