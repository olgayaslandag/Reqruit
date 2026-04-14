<?php

declare(strict_types=1);

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum AdjustmentStatusEnum: string implements HasLabel
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::PENDING => 'Beklemede',
            self::APPROVED => 'Onaylandı',
            self::REJECTED => 'Reddedildi',
        };
    }
}
