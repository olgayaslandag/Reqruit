<?php

namespace App\Mail;

use App\Models\AdvanceRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdvanceRejectedMailable extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public AdvanceRequest $advance
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Avans Talebiniz Reddedildi',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.advance-rejected',
            with: [
                'advance' => $this->advance,
                'employee' => $this->advance->employee,
            ],
        );
    }
}
