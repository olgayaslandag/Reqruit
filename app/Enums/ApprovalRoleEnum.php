<?php

declare(strict_types=1);
namespace App\Enums;

enum ApprovalRoleEnum: string
{
    case MANAGER = 'manager';
    case HR = 'hr';
    case ACCOUNTING = 'accounting';

    public function label(): string
    {
        return match ($this) {
            self::MANAGER => 'Yönetici',
            self::HR => 'İnsan Kaynakları',
            self::ACCOUNTING => 'Muhasebe',
        };
    }

    /**
     * Hangi payroll status'unu onaylar.
     */
    public function correspondingPayrollStatus(): ?PayrollStatusEnum
    {
        return match ($this) {
            self::MANAGER => PayrollStatusEnum::MANAGER_APPROVED,
            self::HR => PayrollStatusEnum::HR_APPROVED,
            self::ACCOUNTING => PayrollStatusEnum::ACCOUNTING_APPROVED,
        };
    }
}
