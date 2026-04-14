<?php

declare(strict_types=1);

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum AttendanceTypeEnum: string implements HasLabel
{
    case CHECK_IN = 'check_in';
    case CHECK_OUT = 'check_out';
    case BREAK_START = 'break_start';
    case BREAK_END = 'break_end';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::CHECK_IN => 'Giriş',
            self::CHECK_OUT => 'Çıkış',
            self::BREAK_START => 'Ara Verme Başlangıcı',
            self::BREAK_END => 'Ara Verme Bitimi',
        };
    }
}
