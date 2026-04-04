<?php

declare(strict_types=1);
namespace App\Enums;

enum EmploymentTypeEnum: string
{
    case FULL_TIME = 'full_time';
    case PART_TIME = 'part_time';
    case REMOTE = 'remote';
    case HYBRID = 'hybrid';

    public function label(): string
    {
        return match ($this) {
            self::FULL_TIME => 'Tam Zamanlı',
            self::PART_TIME => 'Yarı Zamanlı',
            self::REMOTE => 'Uzaktan',
            self::HYBRID => 'Hibrit',
        };
    }
}