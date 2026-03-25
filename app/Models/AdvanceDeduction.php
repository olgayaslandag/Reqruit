<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdvanceDeduction extends Model
{
    use HasFactory;

    protected $fillable = [
        'advance_request_id',
        'payroll_period_id',
        'deduction_amount',
        'remaining_amount',
        'status',
        'deduction_date',
    ];

    protected $casts = [
        'deduction_amount' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'deduction_date' => 'date',
    ];

    /**
     * Advance request ilişkisi.
     */
    public function advanceRequest(): BelongsTo
    {
        return $this->belongsTo(AdvanceRequest::class);
    }

    /**
     * Payroll period ilişkisi.
     */
    public function payrollPeriod(): BelongsTo
    {
        return $this->belongsTo(PayrollPeriod::class);
    }

    /**
     * Bekleyen kesintileri getirir.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Kesilmiş olanları getirir.
     */
    public function scopeDeducted($query)
    {
        return $query->where('status', 'deducted');
    }

    /**
     * Tamamlanmış kesintileri getirir.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }
}
