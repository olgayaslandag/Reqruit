<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceSummary extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'date',
        'work_day_type', // full_day, half_day, weekend, holiday
        'scheduled_start_time',
        'actual_check_in',
        'scheduled_end_time',
        'actual_check_out',
        'actual_break_start',
        'actual_break_end',
        'expected_working_duration',
        'actual_working_duration',
        'overtime_duration',
        'late_duration',
        'early_leave_duration',
        'was_absent',
        'status',
        'notes',
    ];

    protected $casts = [
        'employee_id' => 'integer',
        'date' => 'date',
        'scheduled_start_time' => 'datetime:H:i',
        'actual_check_in' => 'datetime:H:i',
        'scheduled_end_time' => 'datetime:H:i',
        'actual_check_out' => 'datetime:H:i',
        'actual_break_start' => 'datetime:H:i',
        'actual_break_end' => 'datetime:H:i',
        'expected_working_duration' => 'float',
        'actual_working_duration' => 'float',
        'overtime_duration' => 'float',
        'late_duration' => 'float',
        'early_leave_duration' => 'float',
        'was_absent' => 'boolean',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function scopeForDate($query, $date)
    {
        return $query->whereDate('date', $date);
    }

    public function scopeForEmployee($query, $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }

    public function scopeForDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }
}
