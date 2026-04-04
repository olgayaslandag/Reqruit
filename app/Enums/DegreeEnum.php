<?php

declare(strict_types=1);
namespace App\Enums;

enum DegreeEnum: string
{
    case PRIMARY = 'primary';
    case SECONDARY = 'secondary';
    case HIGH_SCHOOL = 'high_school';
    case ASSOCIATE = 'associate';
    case BACHELOR = 'bachelor';
    case MASTER = 'master';
    case DOCTORATE = 'doctorate';

    public function label(): string
    {
        return match ($this) {
            self::PRIMARY => 'Primary School',
            self::SECONDARY => 'Middle School',
            self::HIGH_SCHOOL => 'High School',
            self::ASSOCIATE => 'Associate Degree',
            self::BACHELOR => 'Bachelor',
            self::MASTER => 'Master',
            self::DOCTORATE => 'Doctorate',
        };
    }
}
