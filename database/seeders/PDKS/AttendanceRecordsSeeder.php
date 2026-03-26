<?php

namespace Database\Seeders\PDKS;

use App\Enums\AttendanceSourceEnum;
use App\Enums\AttendanceStatusEnum;
use App\Enums\AttendanceTypeEnum;
use App\Models\AttendanceRecord;
use App\Models\Employee;
use Illuminate\Database\Seeder;

class AttendanceRecordsSeeder extends Seeder
{
    public function run(): void
    {
        $employees = Employee::all();

        if ($employees->isEmpty()) {
            $this->command->warn('No employees found. Run EmployeeSeeder first.');

            return;
        }

        $records = [];
        $types = AttendanceTypeEnum::cases();
        $statuses = AttendanceStatusEnum::cases();
        $sources = AttendanceSourceEnum::cases();

        // Son 30 gün için kayıtlar
        for ($i = 30; $i >= 0; $i--) {
            $date = now()->subDays($i);

            foreach ($employees as $employee) {
                // %10 ihtimalle yok
                if (rand(1, 100) <= 10) {
                    continue;
                }

                // Check-in
                $records[] = [
                    'employee_id' => $employee->id,
                    'date' => $date->toDateString(),
                    'time' => $this->randomTime(7, 10),
                    'type' => $types[array_rand($types)]->value,
                    'source' => $sources[array_rand($sources)]->value,
                    'status' => $this->randomStatus(),
                    'geolocation' => json_encode(['lat' => rand(4100, 4200) / 100, 'lng' => rand(2890, 3000) / 100]),
                    'ip_address' => '192.168.1.'.rand(1, 254),
                    'device_id' => 'DEV-'.rand(1000, 9999),
                    'notes' => null,
                    'processed_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                // Check-out ( %70 ihtimalle)
                if (rand(1, 100) <= 70) {
                    $records[] = [
                        'employee_id' => $employee->id,
                        'date' => $date->toDateString(),
                        'time' => $this->randomTime(16, 23),
                        'type' => AttendanceTypeEnum::CHECK_OUT->value,
                        'source' => $sources[array_rand($sources)]->value,
                        'status' => $this->randomStatus(),
                        'geolocation' => json_encode(['lat' => rand(4100, 4200) / 100, 'lng' => rand(2890, 3000) / 100]),
                        'ip_address' => '192.168.1.'.rand(1, 254),
                        'device_id' => 'DEV-'.rand(1000, 9999),
                        'notes' => null,
                        'processed_at' => now(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        foreach (array_chunk($records, 500) as $chunk) {
            AttendanceRecord::insert($chunk);
        }

        $this->command->info(count($records).' attendance records created.');
    }

    private function randomTime(int $minHour, int $maxHour): string
    {
        return sprintf('%02d:%02d', rand($minHour, $maxHour), rand(0, 59));
    }

    private function randomStatus(): string
    {
        $weights = ['present' => 70, 'late' => 15, 'early_leave' => 10, 'overtime' => 5];
        $rand = rand(1, 100);
        $cumulative = 0;

        foreach ($weights as $status => $weight) {
            $cumulative += $weight;
            if ($rand <= $cumulative) {
                return $status;
            }
        }

        return AttendanceStatusEnum::PRESENT->value;
    }
}
