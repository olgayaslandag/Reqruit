<?php

declare(strict_types=1);
namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum ShiftTypeEnum: string implements HasLabel
{
    case MORNING = 'morning';
    case EVENING = 'evening';
    case NIGHT = 'night';
    case FLEXIBLE = 'flexible';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::MORNING => 'Sabah Vardiyası',
            self::EVENING => 'Akşam Vardiyası',
            self::NIGHT => 'Gece Vardiyası',
            self::FLEXIBLE => 'Esnek Vardiya',
        };
    }
}
