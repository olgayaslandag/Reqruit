<?php

declare(strict_types=1);

namespace Database\Seeders\PDKS;

use Illuminate\Database\Seeder;

class PDKSSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ShiftsSeeder::class,
            WorkCalendarsSeeder::class,
            HolidaysSeeder::class,
            ShiftSchedulesSeeder::class,
            AttendanceRecordsSeeder::class,
            AttendanceAdjustmentsSeeder::class,
        ]);
    }
}
