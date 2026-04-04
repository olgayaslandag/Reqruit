<?php

declare(strict_types=1);
namespace App\Enums;

enum SalaryComponentCategoryEnum: string
{
    case FIXED = 'fixed';
    case VARIABLE = 'variable';

    public function label(): string
    {
        return match ($this) {
            self::FIXED => 'Sabit',
            self::VARIABLE => 'Değişken',
        };
    }
}
