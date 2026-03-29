<?php

namespace Database\Seeders\PDKS;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WorkCalendarsSeeder extends Seeder
{
    public function run(): void
    {
        $calendars = [
            ['name' => 'Standart Hafta İçi', 'description' => 'Pazartesi-Cuma çalışma', 'is_active' => true, 'total_days' => 365, 'working_days' => 252, 'holiday_days' => 113],
            ['name' => 'Haftada 4 Gün', 'description' => 'Pazartesi-Perşembe çalışma', 'is_active' => true, 'total_days' => 365, 'working_days' => 208, 'holiday_days' => 157],
            ['name' => 'Esnek Çalışma', 'description' => 'Esnek çalışma saatleri', 'is_active' => true, 'total_days' => 365, 'working_days' => 240, 'holiday_days' => 125],
            ['name' => 'Haftasonu Dahil', 'description' => 'Haftanın 6 günü çalışma', 'is_active' => false, 'total_days' => 365, 'working_days' => 312, 'holiday_days' => 53],
            ['name' => 'Yoğun Dönem', 'description' => 'Sezonluk yoğun dönem takvimi', 'is_active' => false, 'total_days' => 180, 'working_days' => 150, 'holiday_days' => 30],
            ['name' => 'Gece Vardiyası', 'description' => 'Gece çalışanlar için', 'is_active' => true, 'total_days' => 365, 'working_days' => 260, 'holiday_days' => 105],
        ];

        foreach ($calendars as $calendar) {
            // Check if exists
            $existing = DB::table('work_calendars')->where('name', $calendar['name'])->first();
            if ($existing) {
                DB::table('work_calendars')->where('id', $existing->id)->update($calendar);
            } else {
                DB::table('work_calendars')->insert($calendar);
            }
        }
    }
}
