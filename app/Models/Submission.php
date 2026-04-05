<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Submission extends Model
{
    use HasFactory;

    protected $table = 'submissions';

    protected $fillable = [
        'form_id',
        'reference_no',
        'status',
        'investigation',
    ];

    protected $casts = [
        'status' => 'string',
        'investigation' => 'string',
    ];

    public function form(): BelongsTo
    {
        return $this->belongsTo(Form::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(SubmissionDetail::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(SubmissionComment::class);
    }

    public function getInvestigationLabelAttribute(): string
    {
        return match ($this->investigation) {
            'pending' => 'Bekliyor',
            'completed' => 'Tamamlandı',
            'none' => 'Yapılmadı',
            default => 'Belirsiz',
        };
    }
}
