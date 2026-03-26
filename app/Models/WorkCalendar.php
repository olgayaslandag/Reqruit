<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkCalendar extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'is_active',
        'total_days',
        'working_days',
        'holiday_days',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'total_days' => 'integer',
        'working_days' => 'integer',
        'holiday_days' => 'integer',
    ];

    public function holidays(): HasMany
    {
        return $this->hasMany(Holiday::class);
    }

    public function shiftSchedules(): HasMany
    {
        return $this->hasMany(ShiftSchedule::class);
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class, 'work_calendar_id');
    }

    public function isActive(): bool
    {
        return $this->is_active;
    }
}
