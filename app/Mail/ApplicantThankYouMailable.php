<?php

declare(strict_types=1);
namespace App\Mail;

use App\Models\Submission;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApplicantThankYouMailable extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Submission $submission,
        public string $applicantEmail
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Başvurunuz Alındı - '.$this->submission->reference_no,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.applicant_thankyou',
            with: [
                'referenceNo' => $this->submission->reference_no,
                'formName' => $this->submission->form?->name,
                'departmentName' => $this->submission->form?->department?->title,
                'submittedAt' => $this->submission->created_at,
            ],
        );
    }
}
