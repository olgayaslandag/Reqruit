<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SalaryComponent extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'type',
        'category',
        'description',
        'is_active',
        'is_taxable',
        'is_sgk_applicable',
        'default_amount',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_taxable' => 'boolean',
        'is_sgk_applicable' => 'boolean',
        'default_amount' => 'decimal:2',
        'sort_order' => 'integer',
    ];

    /**
     * Employee salary ilişkisi.
     */
    public function employeeSalaries(): HasMany
    {
        return $this->hasMany(EmployeeSalary::class);
    }

    /**
     * Payroll item ilişkisi.
     */
    public function payrollItems(): HasMany
    {
        return $this->hasMany(PayrollItem::class);
    }

    /**
     * Aktif kalemleri getirir.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Kazanç kalemlerini getirir.
     */
    public function scopeEarnings($query)
    {
        return $query->where('type', 'earning');
    }

    /**
     * Kesinti kalemlerini getirir.
     */
    public function scopeDeductions($query)
    {
        return $query->where('type', 'deduction');
    }

    /**
     * Sabit kalemleri getirir.
     */
    public function scopeFixed($query)
    {
        return $query->where('category', 'fixed');
    }

    /**
     * Değişken kalemleri getirir.
     */
    public function scopeVariable($query)
    {
        return $query->where('category', 'variable');
    }
}
