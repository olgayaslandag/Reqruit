<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubmissionAiEvaluation extends Model
{
    protected $table = 'submission_ai_evaluations';

    protected $fillable = [
        'submission_id',
        'rating',
        'review',
        'provider',
        'model',
        'status',
        'error',
        'created_by',
    ];

    protected $casts = [
        'rating' => 'integer',
        'status' => 'string',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}