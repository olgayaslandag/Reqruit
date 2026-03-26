<?php

namespace App\Models;

use App\Enums\ShiftTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shift extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'start_time',
        'end_time',
        'break_start',
        'break_end',
        'break_duration',
        'tolerance_minutes',
        'is_night',
        'description',
    ];

    protected $casts = [
        'type' => ShiftTypeEnum::class,
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'break_start' => 'datetime:H:i',
        'break_end' => 'datetime:H:i',
        'break_duration' => 'integer',
        'tolerance_minutes' => 'integer',
        'is_night' => 'boolean',
    ];

    public function schedules(): HasMany
    {
        return $this->hasMany(ShiftSchedule::class);
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class, 'default_shift_id');
    }

    public function getExpectedWorkingHoursAttribute(): float
    {
        // Calculate expected working hours based on start/end times and break duration
        $startTime = \Carbon\Carbon::createFromFormat('H:i', $this->start_time);
        $endTime = \Carbon::createFromFormat('H:i', $this->end_time);

        // Handle cases where shift ends after midnight
        if ($endTime->lt($startTime)) {
            $endTime->addDay();
        }

        $totalDuration = $endTime->diffInMinutes($startTime);

        return round(($totalDuration - $this->break_duration) / 60, 2);
    }
}
