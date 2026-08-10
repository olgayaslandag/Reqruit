<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\AttendanceStatusEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AttendanceSummarySeeder extends Seeder
{
    public function run(): void
    {
        $from = now()->subDays(6)->toDateString();
        $existing = DB::table('attendance_summaries')
            ->where('date', '>=', $from)
            ->count();

        if ($existing > 0) {
            $this->command->info("Attendance summaries already seeded ({$existing}). Skipping.");

            return;
        }

        $employeeIds = DB::table('employees')->pluck('id')->toArray();

        if (empty($employeeIds)) {
            $this->command->warn('No employees found.');

            return;
        }

        $scheduledStart = '09:00';
        $scheduledEnd = '18:00';

        // İş günleri için (Pzt-Cum) summary oluştur
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $weekday = $date->dayOfWeek; // 0=Sunday, 6=Saturday

            $summaries = [];

            foreach ($employeeIds as $employeeId) {
                $roll = rand(1, 100);

                // Hafta sonu: çoğunluk devamsız görünmesin -> work_day_type weekend, still present ~%90
                if ($weekday === 0 || $weekday === 6) {
                    $summaries[] = $this->buildSummary($employeeId, $date->toDateString(), 'weekend', $scheduledStart, $scheduledEnd, $roll > 90);
                    continue;
                }

                $summaries[] = $this->buildSummary($employeeId, $date->toDateString(), 'full_day', $scheduledStart, $scheduledEnd, $roll, true);
            }

            foreach (array_chunk($summaries, 200) as $chunk) {
                DB::table('attendance_summaries')->insert($chunk);
            }
        }

        $this->command->info('Created daily attendance summaries for the last 7 days.');
    }

    private function buildSummary(int $employeeId, string $date, string $workDayType, string $start, string $end, int|bool $roll, bool $isWorkday = false): array
    {
        // Weekend: normal devam, nadiren absent
        if ($workDayType === 'weekend') {
            $absent = is_int($roll) ? $roll > 90 : $roll;
            $wasAbsent = $absent;

            return $this->row(
                $employeeId, $date, $workDayType, $start, $end,
                $wasAbsent ? null : '10:00', $wasAbsent ? null : '16:00',
                $wasAbsent ? null : 0.0, $wasAbsent ? null : 0.0, $wasAbsent ? null : 0.0,
                $wasAbsent ? AttendanceStatusEnum::ABSENT : AttendanceStatusEnum::PRESENT,
                $wasAbsent
            );
        }

        $wasAbsent = false;
        $status = AttendanceStatusEnum::PRESENT;
        $checkIn = null;
        $checkOut = null;
        $late = 0.0;
        $early = 0.0;
        $overtime = 0.0;

        if ($roll <= 5) {
            // %5 devamsız
            $wasAbsent = true;
            $status = AttendanceStatusEnum::ABSENT;
        } elseif ($roll <= 18) {
            // %13 geç kalan
            $status = AttendanceStatusEnum::LATE;
            $lateMin = rand(30, 90);
            $late = round($lateMin / 60, 2);
            $inMin = 9 * 60 + $lateMin;
            $checkIn = sprintf('%02d:%02d', intdiv($inMin, 60), $inMin % 60);
            $checkOut = $this->randTime(17, 19);
        } elseif ($roll <= 24) {
            // %6 erken çıkış
            $status = AttendanceStatusEnum::EARLY_LEAVE;
            $earlyMin = rand(30, 120);
            $early = round($earlyMin / 60, 2);
            $outMin = 17 * 60 - $earlyMin;
            $checkIn = $this->randTime(8, 9);
            $checkOut = sprintf('%02d:%02d', intdiv($outMin, 60), $outMin % 60);
        } elseif ($roll <= 32) {
            // %8 fazla mesai
            $status = AttendanceStatusEnum::OVERTIME;
            $otMin = rand(60, 240);
            $overtime = round($otMin / 60, 2);
            $outMin = 18 * 60 + $otMin;
            $checkIn = $this->randTime(8, 9);
            $checkOut = sprintf('%02d:%02d', intdiv($outMin, 60), $outMin % 60);
        } else {
            // normal devam
            $checkIn = $this->randTime(8, 9);
            $checkOut = $this->randTime(17, 19);
        }

        return $this->row(
            $employeeId, $date, $workDayType, $start, $end,
            $checkIn, $checkOut, $late, $early, $overtime,
            $status, $wasAbsent
        );
    }

    private function row(int $employeeId, string $date, string $workDayType, string $start, string $end, ?string $checkIn, ?string $checkOut, ?float $late, ?float $early, ?float $overtime, AttendanceStatusEnum $status, bool $wasAbsent): array
    {
        $actualWorking = null;
        $expected = 8.0;

        if (! $wasAbsent && $checkIn && $checkOut) {
            [$hi, $mi] = array_map('intval', explode(':', $checkIn));
            [$ho, $mo] = array_map('intval', explode(':', $checkOut));
            $inMinutes = $hi * 60 + $mi;
            $outMinutes = $ho * 60 + $mo;
            $worked = max(0, ($outMinutes - $inMinutes) - 60) / 60; // 1 saat mola
            $actualWorking = round($worked, 2);
        }

        return [
            'employee_id' => $employeeId,
            'date' => $date,
            'work_day_type' => $workDayType,
            'scheduled_start_time' => $start,
            'actual_check_in' => $checkIn,
            'scheduled_end_time' => $end,
            'actual_check_out' => $checkOut,
            'actual_break_start' => null,
            'actual_break_end' => null,
            'expected_working_duration' => $expected,
            'actual_working_duration' => $actualWorking ?? 0,
            'overtime_duration' => $overtime ?? 0,
            'late_duration' => $late ?? 0,
            'early_leave_duration' => $early ?? 0,
            'was_absent' => $wasAbsent,
            'status' => $status->value,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    private function randTime(int $minHour, int $maxHour): string
    {
        $hour = rand($minHour, $maxHour);
        $minute = rand(0, 59);

        return sprintf('%02d:%02d', $hour, $minute);
    }
}