<?php

declare(strict_types=1);
namespace App\Enums;

enum PaymentFrequencyEnum: string
{
    case MONTHLY = 'monthly';
    case BIWEEKLY = 'biweekly';
    case WEEKLY = 'weekly';

    public function label(): string
    {
        return match ($this) {
            self::MONTHLY => 'Aylık',
            self::BIWEEKLY => 'İki Haftada Bir',
            self::WEEKLY => 'Haftalık',
        };
    }

    /**
     * Yıllık kaç dönem olduğunu döndürür.
     */
    public function periodsPerYear(): int
    {
        return match ($this) {
            self::MONTHLY => 12,
            self::BIWEEKLY => 26,
            self::WEEKLY => 52,
        };
    }

    /**
     * Ayda kaç dönem olduğunu döndürür.
     */
    public function periodsPerMonth(): float
    {
        return match ($this) {
            self::MONTHLY => 1,
            self::BIWEEKLY => 2,
            self::WEEKLY => 4.33,
        };
    }
}
