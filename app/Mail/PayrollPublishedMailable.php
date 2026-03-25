<?php

namespace App\Mail;

use App\Models\Employee;
use App\Models\PayrollPeriod;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PayrollPublishedMailable extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public PayrollPeriod $period,
        public Employee $employee,
        public array $payrollData
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Bordro Bildirimi - {$this->period->name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.payroll-published',
            with: [
                'period' => $this->period,
                'employee' => $this->employee,
                'payrollData' => $this->payrollData,
            ],
        );
    }
}
