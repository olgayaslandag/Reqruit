<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactInteraction extends Model
{
    protected $table = 'contact_interactions';

    protected $fillable = [
        'candidate_id',
        'submission_id',
        'interaction_type',
        'interaction_date',
        'description',
        'response',
        'created_by',
    ];

    protected $casts = [
        'interaction_date' => 'date',
        'interaction_type' => 'string',
    ];

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getTypeLabelAttribute(): string
    {
        return match ($this->interaction_type) {
            'meeting' => 'Görüşme',
            'phone' => 'Telefon',
            'email' => 'E-posta',
            'offer' => 'Teklif',
            'negotiation' => 'Pazarlık',
            'other' => 'Diğer',
            default => 'Diğer',
        };
    }
}