<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'identity_no',
        'first_name',
        'last_name',
        'birth_date',
        'gender',
        'phone',
        'email',
        'address',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relation',
        'marital_status',
        'children_count',
        'hire_date',
        'position_title',
        'department_id',
        'employment_type',
        'contract_type',
        'manager_id',
        'termination_date',
        'termination_reason',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'hire_date' => 'date',
        'termination_date' => 'date',
        'children_count' => 'integer',
    ];

    protected $appends = ['position_history'];

    /**
     * Frontend için position_history olarak expose edilir.
     */
    public function getPositionHistoryAttribute()
    {
        return $this->positionHistory()->orderByDesc('start_date')->get();
    }

    /**
     * İlişkiler
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(self::class, 'manager_id');
    }

    public function subordinates(): HasMany
    {
        return $this->hasMany(self::class, 'manager_id');
    }

    public function education(): HasMany
    {
        return $this->hasMany(EmployeeEducation::class);
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(EmployeeCertificate::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(EmployeeDocument::class);
    }

    public function positionHistory(): HasMany
    {
        return $this->hasMany(EmployeePositionHistory::class);
    }

    // ======= Payroll Related Relationships =======

    public function employeeSalaries(): HasMany
    {
        return $this->hasMany(EmployeeSalary::class);
    }

    public function payrollItems(): HasMany
    {
        return $this->hasMany(PayrollItem::class);
    }

    public function advanceRequests(): HasMany
    {
        return $this->hasMany(AdvanceRequest::class);
    }

    public function salaryAdjustments(): HasMany
    {
        return $this->hasMany(SalaryAdjustment::class);
    }

    public function bonusPayments(): HasMany
    {
        return $this->hasMany(BonusPayment::class);
    }

    /**
     * Tam adı döndürür.
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Aktif mi kontrolü yapar.
     */
    public function isActive(): bool
    {
        return $this->deleted_at === null;
    }
}
