<?php

declare(strict_types=1);

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

    protected $hidden = [
        'deleted_at',
        'position_history',
    ];

    // Accessor for identity_no with masking
    public function getIdentityNoAttribute(?string $value): ?string
    {
        if (! $this->hasPermissionToViewFullIdentityNo()) {
            // Mask identity number for unauthorized access
            return $this->maskIdentityNumber($value);
        }

        return $value; // Return full number for authorized access
    }

    // Method to mask identity number
    private function maskIdentityNumber(?string $identityNo): ?string
    {
        if (! $identityNo || strlen($identityNo) !== 11) {
            return $identityNo;
        }

        // Show only last 4 digits, mask others with X
        return 'XXXXX'.substr($identityNo, -4);
    }

    // Check if authenticated user has permission to view full identity number
    private function hasPermissionToViewFullIdentityNo(): bool
    {
        // Currently authenticated user can view full identity only for themselves
        // Or if they have broader permissions (managers, HR, admins)
        $user = auth()->user();
        if (! $user) {
            return false;
        }

        // If the employee belongs to the logged in user
        if ($this->user_id && $user->id === $this->user_id) {
            return true;
        }

        // You can customize this based on role/permission system
        // This is a basic check assuming certain roles can see full identity
        $authorizedRolesOrPermissions = ['admin', 'hr_manager', 'hr']; // customize based on your app

        // Return true if user has one of these roles
        // Note: This needs to connect to your permission system
        // The following is a simplified version, you may need to adjust it
        return in_array($user->role ?? '', $authorizedRolesOrPermissions) ||
               ($user->permissions ?? collect([]))->contains('view-full-identity-info');
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

    // ======= PDKS Related Relationships =======

    public function shiftSchedules(): HasMany
    {
        return $this->hasMany(ShiftSchedule::class);
    }

    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class);
    }

    public function attendanceSummaries(): HasMany
    {
        return $this->hasMany(AttendanceSummary::class);
    }

    public function attendanceAdjustments(): HasMany
    {
        return $this->hasMany(AttendanceAdjustment::class);
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class, 'default_shift_id');
    }

    public function workCalendar(): BelongsTo
    {
        return $this->belongsTo(WorkCalendar::class);
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
