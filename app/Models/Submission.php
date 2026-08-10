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

    public function intelligenceReports(): HasMany
    {
        return $this->hasMany(IntelligenceReport::class);
    }

    public function interactions(): HasMany
    {
        return $this->hasMany(ContactInteraction::class);
    }

    public function aiEvaluations(): HasMany
    {
        return $this->hasMany(SubmissionAiEvaluation::class)->orderBy('created_at', 'desc');
    }

    public function getInvestigationLabelAttribute(): string
    {
        // For backward compatibility, still check the old investigation field first
        if (!empty($this->investigation)) {
            return match ($this->investigation) {
                'pending' => 'Bekliyor',
                'completed' => 'Tamamlandı',
                'none' => 'Yapılmadı',
                default => 'Belirsiz',
            };
        }

        // If no old investigation data exists, get from the latest IntelligenceReport
        $latestReport = $this->intelligenceReports()->latest('created_at')->first();
        
        return $latestReport ? $this->getStatusLabel($latestReport->status) : 'Belirsiz';
    }

    public function getCurrentInvestigationAttribute()
    {
        $latestReport = $this->intelligenceReports()->latest('created_at')->first();

        if (!$latestReport) {
            // Fallback to the old investigation field for backward compatibility
            return $this->investigation ?? null;
        }

        return $latestReport->status;
    }

    public function getCurrentInvestigationNotesAttribute()
    {
        $latestReport = $this->intelligenceReports()->latest('created_at')->first();
        
        if (!$latestReport) {
            // Since there is no corresponding old field for notes, return null
            return null;
        }

        return $latestReport->notes;
    }

    private function getStatusLabel(string $status): string
    {
        return match ($status) {
            'pending' => 'Bekliyor',
            'completed' => 'Tamamlandı',
            'none' => 'Yapılmadı',
            default => 'Belirsiz',
        };
    }
}
