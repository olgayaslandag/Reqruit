<?php

declare(strict_types=1);
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'payroll_period_id',
        'employee_id',
        'salary_component_id',
        'amount',
        'calculated_amount',
        'quantity',
        'unit_price',
        'description',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'calculated_amount' => 'decimal:2',
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
    ];

    /**
     * Payroll period ilişkisi.
     */
    public function payrollPeriod(): BelongsTo
    {
        return $this->belongsTo(PayrollPeriod::class);
    }

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
     * Kazanç kalemlerini getirir.
     */
    public function scopeEarnings($query)
    {
        return $query->whereHas('salaryComponent', function ($q) {
            $q->where('type', 'earning');
        });
    }

    /**
     * Kesinti kalemlerini getirir.
     */
    public function scopeDeductions($query)
    {
        return $query->whereHas('salaryComponent', function ($q) {
            $q->where('type', 'deduction');
        });
    }
}
