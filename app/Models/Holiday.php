<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\HolidayTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Holiday extends Model
{
    use HasFactory;

    protected $table = 'holidays';

    protected $fillable = [
        'work_calendar_id',
        'name',
        'date',
        'type',
        'description',
        'is_recurring',
    ];

    protected $casts = [
        'work_calendar_id' => 'integer',
        'date' => 'date',
        'type' => HolidayTypeEnum::class,
        'is_recurring' => 'boolean',
    ];

    public function workCalendar(): BelongsTo
    {
        return $this->belongsTo(WorkCalendar::class);
    }

    public function isDateHoliday($date): bool
    {
        if ($this->is_recurring) {
            // For recurring holidays, compare only month and day
            return $this->date->month === $date->month && $this->date->day === $date->day;
        } else {
            // For non-recurring holidays, compare full date
            return $this->date->toDateString() === $date->toDateString();
        }
    }
}
