<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AttendanceSourceEnum;
use App\Enums\AttendanceStatusEnum;
use App\Enums\AttendanceTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceRecord extends Model
{
    use HasFactory;

    protected $table = 'attendance_records';

    protected $fillable = [
        'employee_id',
        'date',
        'time',
        'type',
        'source',
        'status',
        'geolocation',
        'ip_address',
        'device_id',
        'notes',
        'processed_at',
    ];

    protected $casts = [
        'employee_id' => 'integer',
        'date' => 'date',
        'type' => AttendanceTypeEnum::class,
        'source' => AttendanceSourceEnum::class,
        'status' => AttendanceStatusEnum::class,
        'geolocation' => 'array',
        'processed_at' => 'datetime',
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

    public function scopeForType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeForDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }
}
