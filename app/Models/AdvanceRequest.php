<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AdvanceStatusEnum;
use App\Enums\AdvanceTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AdvanceRequest extends Model
{
    use HasFactory;

    protected $table = 'advance_requests';

    protected $fillable = [
        'employee_id',
        'type',
        'amount',
        'reason',
        'requested_date',
        'status',
        'approver_id',
        'approved_at',
        'rejection_reason',
        'payment_date',
        'notes',
    ];

    protected $casts = [
        'type' => AdvanceTypeEnum::class,
        'amount' => 'decimal:2',
        'requested_date' => 'date',
        'payment_date' => 'date',
        'approved_at' => 'datetime',
    ];

    /**
     * Employee ilişkisi.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Approver ilişkisi.
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    /**
     * Advance deductions ilişkisi.
     */
    public function deductions(): HasMany
    {
        return $this->hasMany(AdvanceDeduction::class);
    }

    /**
     * Durumu enum olarak döndürür.
     */
    public function getStatusEnum(): AdvanceStatusEnum
    {
        return AdvanceStatusEnum::from($this->status);
    }

    /**
     * Bekleyen talepleri getirir.
     */
    public function scopePending($query)
    {
        return $query->where('status', AdvanceStatusEnum::PENDING->value);
    }

    /**
     * Onaylanmış talepleri getirir.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', AdvanceStatusEnum::APPROVED->value);
    }

    /**
     * Ödenmiş talepleri getirir.
     */
    public function scopePaid($query)
    {
        return $query->where('status', AdvanceStatusEnum::PAID->value);
    }

    /**
     * Kalan tutarı hesaplar.
     */
    public function getRemainingAmountAttribute(): float
    {
        $deducted = $this->deductions()
            ->where('status', 'deducted')
            ->sum('deduction_amount');

        return (float) $this->amount - (float) $deducted;
    }
}
