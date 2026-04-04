<?php

declare(strict_types=1);
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveEntitlement extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'leave_type_id',
        'entitled_days',
        'used_days',
        'calculation_year_start',
        'accrual_date',
        'can_carry_over',
        'max_carry_over_days',
    ];

    protected $casts = [
        'entitled_days' => 'integer',
        'used_days' => 'integer',
        'calculation_year_start' => 'date',
        'accrual_date' => 'date',
        'can_carry_over' => 'boolean',
        'max_carry_over_days' => 'integer',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function leaveType(): BelongsTo
    {
        return $this->belongsTo(LeaveType::class);
    }

    public function getRemainingDaysAttribute(): int
    {
        return max(0, $this->entitled_days - $this->used_days);
    }
}
