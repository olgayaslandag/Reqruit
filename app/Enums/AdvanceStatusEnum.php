<?php

declare(strict_types=1);

namespace App\Enums;

enum AdvanceStatusEnum: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case PAID = 'paid';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Bekliyor',
            self::APPROVED => 'Onaylandı',
            self::REJECTED => 'Reddedildi',
            self::PAID => 'Ödendi',
            self::CANCELLED => 'İptal Edildi',
        };
    }

    /**
     * Onay sürecinde mi kontrolü yapar.
     */
    public function isPending(): bool
    {
        return $this === self::PENDING;
    }

    /**
     * Ödenebilir durumda mı kontrolü yapar.
     */
    public function canBePaid(): bool
    {
        return $this === self::APPROVED;
    }

    /**
     * İptal edilebilir durumda mı kontrolü yapar.
     */
    public function canBeCancelled(): bool
    {
        return in_array($this, [self::PENDING, self::APPROVED]);
    }
}
