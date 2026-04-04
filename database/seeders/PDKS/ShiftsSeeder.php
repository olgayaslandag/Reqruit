<?php

declare(strict_types=1);


namespace Database\Seeders\PDKS;

use App\Enums\ShiftTypeEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShiftsSeeder extends Seeder
{
    public function run(): void
    {
        $shifts = [
            ['name' => 'Sabah (08:00-17:00)', 'type' => ShiftTypeEnum::MORNING, 'start_time' => '08:00', 'end_time' => '17:00', 'break_start' => '12:00', 'break_end' => '13:00', 'break_duration' => 60, 'tolerance_minutes' => 15, 'is_night' => false],
            ['name' => 'Sabah (09:00-18:00)', 'type' => ShiftTypeEnum::MORNING, 'start_time' => '09:00', 'end_time' => '18:00', 'break_start' => '13:00', 'break_end' => '14:00', 'break_duration' => 60, 'tolerance_minutes' => 15, 'is_night' => false],
            ['name' => 'Öğleden Sonra (13:00-22:00)', 'type' => ShiftTypeEnum::EVENING, 'start_time' => '13:00', 'end_time' => '22:00', 'break_start' => '17:00', 'break_end' => '18:00', 'break_duration' => 60, 'tolerance_minutes' => 15, 'is_night' => false],
            ['name' => 'Akşam (14:00-23:00)', 'type' => ShiftTypeEnum::EVENING, 'start_time' => '14:00', 'end_time' => '23:00', 'break_start' => '18:00', 'break_end' => '19:00', 'break_duration' => 60, 'tolerance_minutes' => 15, 'is_night' => false],
            ['name' => 'Gece (22:00-06:00)', 'type' => ShiftTypeEnum::NIGHT, 'start_time' => '22:00', 'end_time' => '06:00', 'break_start' => '02:00', 'break_end' => '03:00', 'break_duration' => 60, 'tolerance_minutes' => 15, 'is_night' => true],
            ['name' => 'Gece (23:00-07:00)', 'type' => ShiftTypeEnum::NIGHT, 'start_time' => '23:00', 'end_time' => '07:00', 'break_start' => '03:00', 'break_end' => '04:00', 'break_duration' => 60, 'tolerance_minutes' => 15, 'is_night' => true],
            ['name' => 'Uzun Sabah (07:00-18:00)', 'type' => ShiftTypeEnum::MORNING, 'start_time' => '07:00', 'end_time' => '18:00', 'break_start' => '12:30', 'break_end' => '13:30', 'break_duration' => 60, 'tolerance_minutes' => 20, 'is_night' => false],
            ['name' => 'Kısa Vardiya (10:00-16:00)', 'type' => ShiftTypeEnum::FLEXIBLE, 'start_time' => '10:00', 'end_time' => '16:00', 'break_start' => '12:30', 'break_end' => '13:00', 'break_duration' => 30, 'tolerance_minutes' => 10, 'is_night' => false],
            ['name' => 'Esnek (09:00-18:00)', 'type' => ShiftTypeEnum::FLEXIBLE, 'start_time' => '09:00', 'end_time' => '18:00', 'break_start' => '12:00', 'break_end' => '13:00', 'break_duration' => 60, 'tolerance_minutes' => 30, 'is_night' => false],
            ['name' => 'Haftasonu (10:00-20:00)', 'type' => ShiftTypeEnum::FLEXIBLE, 'start_time' => '10:00', 'end_time' => '20:00', 'break_start' => '14:00', 'break_end' => '15:00', 'break_duration' => 60, 'tolerance_minutes' => 15, 'is_night' => false],
            ['name' => 'Gece Yarısı (20:00-04:00)', 'type' => ShiftTypeEnum::NIGHT, 'start_time' => '20:00', 'end_time' => '04:00', 'break_start' => '00:00', 'break_end' => '01:00', 'break_duration' => 60, 'tolerance_minutes' => 15, 'is_night' => true],
            ['name' => 'Süreklı (08:00-20:00)', 'type' => ShiftTypeEnum::MORNING, 'start_time' => '08:00', 'end_time' => '20:00', 'break_start' => '12:00', 'break_end' => '13:00', 'break_duration' => 60, 'tolerance_minutes' => 20, 'is_night' => false],
        ];

        foreach ($shifts as $shift) {
            // Check if exists
            $existing = DB::table('shifts')->where('name', $shift['name'])->first();
            if ($existing) {
                DB::table('shifts')->where('id', $existing->id)->update($shift);
            } else {
                DB::table('shifts')->insert($shift);
            }
        }
    }
}
