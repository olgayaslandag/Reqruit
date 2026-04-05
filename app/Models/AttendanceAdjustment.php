<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AdjustmentStatusEnum;
use App\Enums\AdjustmentTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceAdjustment extends Model
{
    use HasFactory;

    protected $table = 'attendance_adjustments';

    protected $fillable = [
        'employee_id',
        'attendance_record_id',
        'request_date',
        'adjustment_date',
        'from_time',
        'to_time',
        'reason',
        'type',
        'status',
        'requested_by',
        'approved_by',
        'approved_at',
        'rejection_reason',
    ];

    protected $casts = [
        'employee_id' => 'integer',
        'attendance_record_id' => 'integer',
        'request_date' => 'date',
        'adjustment_date' => 'date',
        'from_time' => 'datetime:H:i',
        'to_time' => 'datetime:H:i',
        'type' => AdjustmentTypeEnum::class,
        'status' => AdjustmentStatusEnum::class,
        'requested_by' => 'integer',
        'approved_by' => 'integer',
        'approved_at' => 'datetime',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function attendanceRecord(): BelongsTo
    {
        return $this->belongsTo(AttendanceRecord::class);
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function scopePending($query)
    {
        return $query->where('status', AdjustmentStatusEnum::PENDING);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', AdjustmentStatusEnum::APPROVED);
    }

    public function scopeRejected($query)
    {
        return $query->where('status', AdjustmentStatusEnum::REJECTED);
    }
}
