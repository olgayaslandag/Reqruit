<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Candidate extends Model
{
    use HasFactory;

    protected $table = 'candidates';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'current_employer',
        'current_position',
        'source',
        'status',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function interactions(): HasMany
    {
        return $this->hasMany(ContactInteraction::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}