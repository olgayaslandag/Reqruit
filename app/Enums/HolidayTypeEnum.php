<?php

declare(strict_types=1);

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum HolidayTypeEnum: string implements HasLabel
{
    case OFFICIAL = 'official';
    case COMPANY = 'company';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::OFFICIAL => 'Resmi Tatil',
            self::COMPANY => 'Şirket Tatili',
        };
    }
}
