<?php

namespace App\Mail;

use App\Models\Submission;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewSubmissionMailable extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Submission $submission
    ) {}

    public function envelope(): Envelope
    {
        $applicantName = $this->getApplicantName();

        return new Envelope(
            subject: 'Yeni Başvuru - '.($applicantName ?: $this->submission->reference_no),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.new_submission',
            with: [
                'referenceNo' => $this->submission->reference_no,
                'applicantName' => $this->getApplicantName(),
                'formName' => $this->submission->form?->name,
                'departmentName' => $this->submission->form?->department?->title,
                'submittedAt' => $this->submission->created_at,
                'adminUrl' => url('/admin/submissions/'.$this->submission->id),
            ],
        );
    }

    /**
     * Get applicant name from form fields
     */
    private function getApplicantName(): ?string
    {
        $form = $this->submission->form;
        if (! $form) {
            return null;
        }

        // Find name fields in form
        $nameFields = $form->fields()
            ->where(function ($query) {
                $query->where('name', 'like', '%ad%')
                    ->orWhere('name', 'like', '%soyad%')
                    ->orWhere('name', 'like', '%name%')
                    ->orWhere('label', 'like', '%Ad%')
                    ->orWhere('label', 'like', '%Soyad%')
                    ->orWhere('label', 'like', '%İsim%');
            })
            ->get();

        $names = [];
        foreach ($nameFields as $field) {
            $detail = $this->submission->details()
                ->where('field_name', $field->name)
                ->first();

            if ($detail && $detail->field_value) {
                $names[] = $detail->field_value;
            }
        }

        return ! empty($names) ? implode(' ', $names) : null;
    }

    /**
     * Get the addresses to send the notification to.
     * Priority: Form notification_emails > Department emails
     */
    public function getRecipients(): array
    {
        $emails = [];

        // Form'un notification_emails'ini kontrol et
        if (! empty($this->submission->form?->notification_emails)) {
            $emails = $this->submission->form->notification_emails;
        }
        // Yoksa department'un emails'ini kontrol et
        elseif (! empty($this->submission->form?->department?->emails)) {
            $emails = $this->submission->form->department->emails;
        }

        return $emails;
    }
}
