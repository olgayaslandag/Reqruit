<?php

declare(strict_types=1);
namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum AdjustmentTypeEnum: string implements HasLabel
{
    case MISSING = 'missing';
    case WRONG = 'wrong';
    case OVERTIME_REQUEST = 'overtime_request';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::MISSING => 'Eksik Kayıt',
            self::WRONG => 'Hatalı Kayıt',
            self::OVERTIME_REQUEST => 'Fazla Mesai Talebi',
        };
    }
}
