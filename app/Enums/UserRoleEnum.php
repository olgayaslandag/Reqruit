<?php

declare(strict_types=1);

namespace App\Enums;

enum UserRoleEnum: int
{
    case ADMIN = 1;
    case IK_MANAGER = 2;
    case RECRUITER = 3;
    case DEPARTMENT_HEAD = 4;
    case OBSERVER = 5;

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Yönetici',
            self::IK_MANAGER => 'İK Yöneticisi',
            self::RECRUITER => 'İşe Alım Uzmanı',
            self::DEPARTMENT_HEAD => 'Departman Sorumlusu',
            self::OBSERVER => 'Gözlemci',
        };
    }
}
