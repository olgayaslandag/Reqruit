<?php

declare(strict_types=1);
namespace App\Enums;

enum UserStatusEnum: int
{
    case ACTIVE = 1;
    case INACTIVE = 2;
    case PENDING = 3;

    public function label(): string
    {
        return match ($this) {
            self::ACTIVE => 'Aktif',
            self::INACTIVE => 'Pasif',
            self::PENDING => 'Beklemede',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::ACTIVE => 'green',
            self::INACTIVE => 'red',
            self::PENDING => 'yellow',
        };
    }
}
