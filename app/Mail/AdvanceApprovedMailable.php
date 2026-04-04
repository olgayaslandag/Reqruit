<?php

declare(strict_types=1);
namespace App\Mail;

use App\Models\AdvanceRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdvanceApprovedMailable extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public AdvanceRequest $advance
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Avans Talebiniz Onaylandı',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.advance-approved',
            with: [
                'advance' => $this->advance,
                'employee' => $this->advance->employee,
            ],
        );
    }
}
