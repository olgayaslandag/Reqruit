<?php

declare(strict_types=1);

namespace App\Enums;

enum DocumentTypeEnum: string
{
    case CONTRACT = 'contract';
    case DIPLOMA = 'diploma';
    case CERTIFICATE = 'certificate';
    case ID_COPY = 'id_copy';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::CONTRACT => 'Sözleşme',
            self::DIPLOMA => 'Diploma',
            self::CERTIFICATE => 'Sertifika',
            self::ID_COPY => 'Kimlik Fotokopisi',
            self::OTHER => 'Diğer',
        };
    }
}
