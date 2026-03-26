<?php

namespace Database\Seeders;

use App\Enums\AdvanceStatusEnum;
use App\Enums\AdvanceTypeEnum;
use App\Models\AdvanceRequest;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdvanceRequestSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Avans talepleri oluşturuluyor...');

        // Tüm çalışanları al
        $employees = Employee::all();
        $users = User::limit(10)->get();

        if ($employees->isEmpty()) {
            $this->command->warn('Hiç çalışan bulunamadı, önce çalışan ekleyin');

            return;
        }

        $statuses = [
            AdvanceStatusEnum::PENDING->value,
            AdvanceStatusEnum::APPROVED->value,
            AdvanceStatusEnum::REJECTED->value,
            AdvanceStatusEnum::PAID->value,
        ];

        $advanceTypes = AdvanceTypeEnum::values();

        // 200+ avans talebi oluştur
        $batchSize = 50;
        $totalRequests = 250;

        for ($i = 0; $i < $totalRequests; $i++) {
            $employee = $employees->random();
            $status = $statuses[array_rand($statuses)];
            $type = $advanceTypes[array_rand($advanceTypes)];
            $typeLabel = AdvanceTypeEnum::from($type)->label();

            $amount = rand(1000, 25000);

            $requestData = [
                'employee_id' => $employee->id,
                'type' => $type,
                'amount' => $amount,
                'reason' => $typeLabel,
                'requested_date' => now()->subDays(rand(0, 180)),
                'status' => $status,
                'notes' => 'Otomatik oluşturulmuş avans talebi #'.($i + 1),
            ];

            // Onaylanmış veya ödenmişse
            if (in_array($status, [AdvanceStatusEnum::APPROVED->value, AdvanceStatusEnum::PAID->value]) && $users->isNotEmpty()) {
                $requestData['approver_id'] = $users->random()->id;
                $requestData['approved_at'] = now()->subDays(rand(1, 15));

                if ($status === AdvanceStatusEnum::PAID->value) {
                    $requestData['payment_date'] = now()->subDays(rand(0, 10))->format('Y-m-d');
                }
            }

            // Reddedilmişse
            if ($status === AdvanceStatusEnum::REJECTED->value && rand(0, 1)) {
                $rejectionReasons = [
                    'Belgeler eksik',
                    'Yetersiz sebep',
                    'Bütçe dışı',
                    'Aynı dönem içerisinde çok fazla avans talebi',
                    'İzin süreci eksik',
                    'Şirket politikasına aykırı',
                ];
                $requestData['rejection_reason'] = $rejectionReasons[array_rand($rejectionReasons)];
            }

            AdvanceRequest::create($requestData);

            // Batch logging
            if (($i + 1) % $batchSize === 0) {
                $this->command->info(($i + 1).' avans talebi oluşturuldu...');
            }
        }

        $this->command->info('Toplam '.AdvanceRequest::count().' adet avans talebi oluşturuldu.');
    }
}
