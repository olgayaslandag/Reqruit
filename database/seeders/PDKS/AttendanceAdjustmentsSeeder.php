<?php

declare(strict_types=1);


namespace Database\Seeders\PDKS;

use App\Enums\AdjustmentStatusEnum;
use App\Enums\AdjustmentTypeEnum;
use App\Models\AttendanceAdjustment;
use App\Models\AttendanceRecord;
use App\Models\Employee;
use Illuminate\Database\Seeder;

class AttendanceAdjustmentsSeeder extends Seeder
{
    public function run(): void
    {
        $employees = Employee::all();
        $records = AttendanceRecord::all();

        if ($employees->isEmpty() || $records->isEmpty()) {
            $this->command->warn('Run AttendanceRecordsSeeder first.');

            return;
        }

        $adjustments = [];
        $reasons = [
            'Unutma nedeniyle giriş yapılamadı',
            'Yanlış saat girildi düzeltme talebi',
            'Geç kaldım trafik',
            'Acil durum nedeniyle erken çıkış',
            'Toplantı sonrası geç çıkış',
            'Sistem hatası kayıt alınamadı',
            'Randevu nedeniyle erken çıkış',
            'Sağlık sorunu',
            'Aile acil durumu',
        ];

        // 60 düzeltme talebi
        for ($i = 0; $i < 60; $i++) {
            $record = $records->random();
            $status = $this->randomStatus();
            $type = AdjustmentTypeEnum::cases()[array_rand(AdjustmentTypeEnum::cases())];
            $requestedBy = 1; // Admin
            $approvedBy = $status->value !== 'pending' ? 1 : null;

            $adjustments[] = [
                'employee_id' => $record->employee_id,
                'attendance_record_id' => $record->id,
                'request_date' => now()->subDays(rand(1, 25))->toDateString(),
                'adjustment_date' => $record->date,
                'from_time' => $this->randomTime(8, 12),
                'to_time' => $this->randomTime(16, 20),
                'reason' => $reasons[array_rand($reasons)],
                'type' => $type->value,
                'status' => $status->value,
                'requested_by' => $requestedBy,
                'approved_by' => $approvedBy,
                'approved_at' => $status->value !== 'pending' ? now() : null,
                'rejection_reason' => $status->value === 'rejected' ? 'Yetersiz bilgi' : null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        AttendanceAdjustment::insert($adjustments);
        $this->command->info(count($adjustments).' attendance adjustments created.');
    }

    private function randomTime(int $minHour, int $maxHour): string
    {
        return sprintf('%02d:%02d', rand($minHour, $maxHour), rand(0, 59));
    }

    private function randomStatus(): AdjustmentStatusEnum
    {
        $weights = [
            'pending' => 40,
            'approved' => 45,
            'rejected' => 15,
        ];

        $rand = rand(1, 100);
        $cumulative = 0;

        foreach ($weights as $status => $weight) {
            $cumulative += $weight;
            if ($rand <= $cumulative) {
                return AdjustmentStatusEnum::from($status);
            }
        }

        return AdjustmentStatusEnum::PENDING;
    }
}
