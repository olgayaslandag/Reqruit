<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ApprovalRoleEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollApproval extends Model
{
    use HasFactory;

    protected $table = 'payroll_approvals';

    protected $fillable = [
        'payroll_period_id',
        'approver_id',
        'role',
        'status',
        'comment',
        'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    /**
     * Payroll period ilişkisi.
     */
    public function payrollPeriod(): BelongsTo
    {
        return $this->belongsTo(PayrollPeriod::class);
    }

    /**
     * Approver (onaylayan) ilişkisi.
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    /**
     * Rolü enum olarak döndürür.
     */
    public function getRoleEnum(): ApprovalRoleEnum
    {
        return ApprovalRoleEnum::from($this->role);
    }

    /**
     * Onay bekleyenleri getirir.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Onaylanmış olanları getirir.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Reddedilmiş olanları getirir.
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
}
