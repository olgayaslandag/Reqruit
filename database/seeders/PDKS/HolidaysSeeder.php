<?php

declare(strict_types=1);

namespace Database\Seeders\PDKS;

use App\Enums\HolidayTypeEnum;
use App\Models\Holiday;
use App\Models\WorkCalendar;
use Illuminate\Database\Seeder;

class HolidaysSeeder extends Seeder
{
    public function run(): void
    {
        $calendar = WorkCalendar::where('name', 'Standart Hafta İçi')->first();

        $holidays = [
            ['name' => 'Yılbaşı', 'date' => '2026-01-01', 'type' => HolidayTypeEnum::OFFICIAL, 'is_recurring' => true],
            ['name' => 'Ulusal Egemenlik ve Çocuk Bayramı', 'date' => '2026-04-23', 'type' => HolidayTypeEnum::OFFICIAL, 'is_recurring' => true],
            ['name' => 'Emek ve Dayanışma Günü', 'date' => '2026-05-01', 'type' => HolidayTypeEnum::OFFICIAL, 'is_recurring' => true],
            ['name' => 'Atatürk\'ü Anma Gençlik ve Spor Bayramı', 'date' => '2026-05-19', 'type' => HolidayTypeEnum::OFFICIAL, 'is_recurring' => true],
            ['name' => 'Ramazan Bayramı (1. Gün)', 'date' => '2026-05-09', 'type' => HolidayTypeEnum::OFFICIAL, 'is_recurring' => false],
            ['name' => 'Ramazan Bayramı (2. Gün)', 'date' => '2026-05-10', 'type' => HolidayTypeEnum::OFFICIAL, 'is_recurring' => false],
            ['name' => 'Ramazan Bayramı (3. Gün)', 'date' => '2026-05-11', 'type' => HolidayTypeEnum::OFFICIAL, 'is_recurring' => false],
            ['name' => 'Demokratik Anayasa Günü', 'date' => '2026-05-27', 'type' => HolidayTypeEnum::OFFICIAL, 'is_recurring' => false],
            ['name' => 'Kurban Bayramı (1. Gün)', 'date' => '2026-08-20', 'type' => HolidayTypeEnum::OFFICIAL, 'is_recurring' => false],
            ['name' => 'Kurban Bayramı (2. Gün)', 'date' => '2026-08-21', 'type' => HolidayTypeEnum::OFFICIAL, 'is_recurring' => false],
            ['name' => 'Kurban Bayramı (3. Gün)', 'date' => '2026-08-22', 'type' => HolidayTypeEnum::OFFICIAL, 'is_recurring' => false],
            ['name' => 'Kurban Bayramı (4. Gün)', 'date' => '2026-08-23', 'type' => HolidayTypeEnum::OFFICIAL, 'is_recurring' => false],
            ['name' => 'Zafer Bayramı', 'date' => '2026-08-30', 'type' => HolidayTypeEnum::OFFICIAL, 'is_recurring' => true],
            ['name' => 'Cumhuriyet Bayramı', 'date' => '2026-10-29', 'type' => HolidayTypeEnum::OFFICIAL, 'is_recurring' => true],
            ['name' => 'Şirket Yıl Dönümü', 'date' => '2026-06-15', 'type' => HolidayTypeEnum::COMPANY, 'is_recurring' => false],
            ['name' => 'Kuruluş Yıldönümü', 'date' => '2026-03-10', 'type' => HolidayTypeEnum::COMPANY, 'is_recurring' => true],
            ['name' => 'İşçi Bayramı Özel', 'date' => '2026-04-15', 'type' => HolidayTypeEnum::COMPANY, 'is_recurring' => false],
            ['name' => 'Yaz Tatili', 'date' => '2026-07-15', 'type' => HolidayTypeEnum::COMPANY, 'is_recurring' => true],
            ['name' => 'Yıl Sonu Tatili', 'date' => '2026-12-31', 'type' => HolidayTypeEnum::COMPANY, 'is_recurring' => true],
            ['name' => 'İlk Günü', 'date' => '2026-01-02', 'type' => HolidayTypeEnum::COMPANY, 'is_recurring' => false],
            ['name' => 'BahAR', 'date' => '2026-03-21', 'type' => HolidayTypeEnum::OFFICIAL, 'is_recurring' => true],
            ['name' => 'Şirket Pikniği', 'date' => '2026-06-20', 'type' => HolidayTypeEnum::COMPANY, 'is_recurring' => false],
            ['name' => 'Yıl Sonu parti', 'date' => '2026-12-25', 'type' => HolidayTypeEnum::COMPANY, 'is_recurring' => false],
        ];

        foreach ($holidays as $holiday) {
            Holiday::updateOrCreate(
                ['work_calendar_id' => $calendar->id, 'name' => $holiday['name'], 'date' => $holiday['date']],
                array_merge($holiday, ['work_calendar_id' => $calendar->id])
            );
        }
    }
}
