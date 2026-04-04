<?php

declare(strict_types=1);
namespace App\Models;

use App\Enums\PayrollStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PayrollPeriod extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'payment_frequency',
        'payment_date',
        'status',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'payment_date' => 'date',
    ];

    /**
     * Payroll items ilişkisi.
     */
    public function payrollItems(): HasMany
    {
        return $this->hasMany(PayrollItem::class);
    }

    /**
     * Payroll approvals ilişkisi.
     */
    public function approvals(): HasMany
    {
        return $this->hasMany(PayrollApproval::class);
    }

    /**
     * Creator ilişkisi.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Bordro durumunu enum olarak döndürür.
     */
    public function getStatusEnum(): PayrollStatusEnum
    {
        return PayrollStatusEnum::from($this->status);
    }

    /**
     * Taslak olanları getirir.
     */
    public function scopeDraft($query)
    {
        return $query->where('status', PayrollStatusEnum::DRAFT->value);
    }

    /**
     * Yayınlanmış olanları getirir.
     */
    public function scopePublished($query)
    {
        return $query->where('status', PayrollStatusEnum::PUBLISHED->value);
    }

    /**
     * Onay bekleyenleri getirir.
     */
    public function scopePendingApproval($query)
    {
        return $query->whereIn('status', [
            PayrollStatusEnum::DRAFT->value,
            PayrollStatusEnum::MANAGER_APPROVED->value,
            PayrollStatusEnum::HR_APPROVED->value,
            PayrollStatusEnum::ACCOUNTING_APPROVED->value,
        ]);
    }

    /**
     * Dönem içindeki çalışanları getirir.
     */
    public function employeesInPeriod()
    {
        return Employee::where('hire_date', '<=', $this->end_date)
            ->where(function ($query) {
                $query->whereNull('termination_date')
                    ->orWhere('termination_date', '>=', $this->start_date);
            })
            ->whereNull('deleted_at');
    }
}
