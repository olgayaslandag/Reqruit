<?php

declare(strict_types=1);
namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum AttendanceStatusEnum: string implements HasLabel
{
    case PRESENT = 'present';
    case ABSENT = 'absent';
    case LATE = 'late';
    case EARLY_LEAVE = 'early_leave';
    case OVERTIME = 'overtime';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::PRESENT => 'Devlette',
            self::ABSENT => 'Yok',
            self::LATE => 'Geç Gelen',
            self::EARLY_LEAVE => 'Erken Çıkan',
            self::OVERTIME => 'Fazla Mesai',
        };
    }
}
