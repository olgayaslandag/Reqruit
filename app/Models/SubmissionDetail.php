<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class SubmissionDetail extends Model
{
    protected $table = 'submission_details';

    protected $fillable = [
        'submission_id',
        'field_name',
        'field_label',
        'field_value',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    /**
     * Check if this detail contains an uploaded file path.
     */
    public function isFile(): bool
    {
        return str_starts_with($this->field_value, 'submissions/');
    }

    /**
     * Get the file download URL (requires authentication).
     */
    public function getFileUrlAttribute(): ?string
    {
        if (! $this->isFile()) {
            return null;
        }

        return route('files.show', ['path' => $this->field_value]);
    }

    /**
     * Get the file download URL.
     */
    public function getDownloadUrlAttribute(): ?string
    {
        if (! $this->isFile()) {
            return null;
        }

        return route('files.download', ['path' => $this->field_value]);
    }

    /**
     * Check if the file exists in storage.
     */
    public function fileExists(): bool
    {
        if (! $this->isFile()) {
            return false;
        }

        return Storage::disk('local')->exists($this->field_value);
    }

    /**
     * Get the file extension.
     */
    public function getFileExtensionAttribute(): ?string
    {
        if (! $this->isFile()) {
            return null;
        }

        return pathinfo($this->field_value, PATHINFO_EXTENSION);
    }

    /**
     * Get the original filename.
     */
    public function getFileNameAttribute(): ?string
    {
        if (! $this->isFile()) {
            return null;
        }

        return basename($this->field_value);
    }
}
