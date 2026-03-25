<?php

namespace App\Enums;

enum PayrollStatusEnum: string
{
    case DRAFT = 'draft';
    case MANAGER_APPROVED = 'manager_approved';
    case HR_APPROVED = 'hr_approved';
    case ACCOUNTING_APPROVED = 'accounting_approved';
    case PUBLISHED = 'published';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Taslak',
            self::MANAGER_APPROVED => 'Yönetici Onayladı',
            self::HR_APPROVED => 'İK Onayladı',
            self::ACCOUNTING_APPROVED => 'Muhasebe Onayladı',
            self::PUBLISHED => 'Yayımlandı',
        };
    }

    /**
     * Sıradaki onay durumunu döndürür.
     */
    public function nextStatus(): ?PayrollStatusEnum
    {
        return match ($this) {
            self::DRAFT => self::MANAGER_APPROVED,
            self::MANAGER_APPROVED => self::HR_APPROVED,
            self::HR_APPROVED => self::ACCOUNTING_APPROVED,
            self::ACCOUNTING_APPROVED => self::PUBLISHED,
            self::PUBLISHED => null,
        };
    }

    /**
     * Onay sürecinde mi kontrolü yapar.
     */
    public function isInApprovalProcess(): bool
    {
        return in_array($this, [
            self::DRAFT,
            self::MANAGER_APPROVED,
            self::HR_APPROVED,
            self::ACCOUNTING_APPROVED,
        ]);
    }
}
