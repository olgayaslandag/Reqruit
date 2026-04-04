<?php

declare(strict_types=1);
namespace App\Enums;

enum AdvanceTypeEnum: string
{
    case EMERGENCY = 'emergency';
    case COMMITMENT = 'commitment';
    case FUEL = 'fuel';
    case TRAVEL = 'travel';
    case EDUCATION = 'education';
    case HEALTH = 'health';
    case HOUSING = 'housing';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::EMERGENCY => 'Acil Durum',
            self::COMMITMENT => 'Taahhüt',
            self::FUEL => 'Araç Yakıt Tediyesi',
            self::TRAVEL => 'Yol Ücreti',
            self::EDUCATION => 'Eğitim Masrafı',
            self::HEALTH => 'Sağlık Harcaması',
            self::HOUSING => 'Ev Giderleri',
            self::OTHER => 'Diğer',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
