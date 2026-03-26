<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShiftTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'shift_id',
        'work_calendar_id',
        'day_of_week',
        'is_active',
    ];

    protected $casts = [
        'shift_id' => 'integer',
        'work_calendar_id' => 'integer',
        'day_of_week' => 'integer', // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        'is_active' => 'boolean',
    ];

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function workCalendar(): BelongsTo
    {
        return $this->belongsTo(WorkCalendar::class);
    }
}
