<?php

declare(strict_types=1);

namespace App\Enums;

enum MaritalStatusEnum: string
{
    case SINGLE = 'single';
    case MARRIED = 'married';
    case DIVORCED = 'divorced';
    case WIDOWED = 'widowed';

    public function label(): string
    {
        return match ($this) {
            self::SINGLE => 'Bekâr',
            self::MARRIED => 'Evli',
            self::DIVORCED => 'Boşanmış',
            self::WIDOWED => 'Dul',
        };
    }
}
