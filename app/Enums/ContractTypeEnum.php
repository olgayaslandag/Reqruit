<?php

namespace App\Enums;

enum ContractTypeEnum: string
{
    case PERMANENT = 'permanent';
    case FIXED_TERM = 'fixed_term';
    case INTERNSHIP = 'internship';
    case PROBATION = 'probation';

    public function label(): string
    {
        return match ($this) {
            self::PERMANENT => 'Süresiz',
            self::FIXED_TERM => 'Sözleşmeli',
            self::INTERNSHIP => 'Stajyer',
            self::PROBATION => 'Deneme',
        };
    }
}