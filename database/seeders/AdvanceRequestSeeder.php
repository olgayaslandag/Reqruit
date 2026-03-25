<?php

namespace Database\Seeders;

use App\Models\AdvanceRequest;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdvanceRequestSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Avans talepleri oluşturuluyor...');

        // Kullanıcılardan bazılarını ve çalışanları al
        $employees = Employee::limit(10)->get();
        $users = User::limit(5)->get();

        if ($employees->isEmpty()) {
            $this->command->warn('Hiç çalışan bulunamadı, önce çalışan ekleyin');

            return;
        }

        // Farklı durumlarda avans talepleri oluşturalım
        $statuses = ['pending', 'approved', 'rejected', 'paid'];

        $advanceTypes = [
            'Acil Durum',
            'Taahhüt',
            'Araç Yakıt Tediyesi',
            'Yol Ücreti',
            'Eğitim Masrafı',
            'Sağlık Harcaması',
            'Ev Giderleri',
            'Diğer',
        ];

        for ($i = 0; $i < 20; $i++) {
            $employee = $employees->random();
            $status = $statuses[array_rand($statuses)];
            $type = $advanceTypes[array_rand($advanceTypes)];

            $amount = rand(1000, 15000); // 1000-15000 TL arası

            $requestData = [
                'employee_id' => $employee->id,
                'amount' => $amount,
                'reason' => $type,
                'requested_date' => now()->subDays(rand(0, 30)),
                'status' => $status,
                'notes' => 'Otomatik oluşturulmuş avans talebi ('.($i + 1).')',
            ];

            // Eğer durum onaylanmışsa ve kullanıcı mevcutsa approver_id eklenebilir
            if (in_array($status, ['approved', 'paid']) && $users->isNotEmpty()) {
                $requestData['approver_id'] = $users->random()->id;
                $requestData['payment_date'] = in_array($status, ['paid']) ? now()->subDays(rand(0, 15))->format('Y-m-d') : null;
            }

            // Eğer durum reddedilmişse nedeni belirtilir
            if ($status === 'rejected' && rand(0, 5) > 2) {
                $requestData['rejection_reason'] = [
                    'Belgeler eksik',
                    'Yetersiz sebep',
                    'Bütçe dışı',
                    'Aynı dönem içerisinde çok fazla avans talebi',
                    'İzin süreci eksik',
                ][rand(0, 4)];
            }

            AdvanceRequest::create($requestData);
        }

        $this->command->info('Toplam '.AdvanceRequest::count().' adet avans talebi oluşturuldu.');
    }
}
