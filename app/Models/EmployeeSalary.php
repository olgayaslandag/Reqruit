<?php

namespace App\Models;

use App\Enums\PaymentFrequencyEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeSalary extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'salary_component_id',
        'amount',
        'start_date',
        'end_date',
        'payment_frequency',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Employee ilişkisi.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Salary component ilişkisi.
     */
    public function salaryComponent(): BelongsTo
    {
        return $this->belongsTo(SalaryComponent::class);
    }

    /**
     * Aktif maaş yapılandırmalarını getirir.
     */
    public function scopeActive($query)
    {
        return $query->whereNull('end_date')
            ->orWhere('end_date', '>=', now()->toDateString());
    }

    /**
     * Verilen tarihte aktif olan maaş yapılandırmasını getirir.
     */
    public function scopeActiveOn($query, $date)
    {
        return $query->where('start_date', '<=', $date)
            ->where(function ($q) use ($date) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', $date);
            });
    }

    /**
     * Ödeme sıklığını enum olarak döndürür.
     */
    public function getPaymentFrequencyEnum(): PaymentFrequencyEnum
    {
        return PaymentFrequencyEnum::from($this->payment_frequency);
    }
}
