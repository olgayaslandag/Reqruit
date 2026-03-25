<?php

namespace App\Enums;

enum GenderEnum: string
{
    case MALE = 'male';
    case FEMALE = 'female';
    case NOT_SPECIFIED = 'not_specified';

    public function label(): string
    {
        return match ($this) {
            self::MALE => 'Erkek',
            self::FEMALE => 'Kadın',
            self::NOT_SPECIFIED => 'Belirtilmemiş',
        };
    }
}