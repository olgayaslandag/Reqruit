<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum AttendanceSourceEnum: string implements HasLabel
{
    case DEVICE = 'device';
    case MOBILE = 'mobile';
    case WEB = 'web';
    case API = 'api';
    case MANUAL = 'manual';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::DEVICE => 'Cihaz',
            self::MOBILE => 'Mobil Uygulama',
            self::WEB => 'Web Paneli',
            self::API => 'API Entegrasyonu',
            self::MANUAL => 'Manuel Girdi',
        };
    }
}
