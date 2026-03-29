<?php

namespace Database\Seeders;

use App\Models\LeaveType;
use Illuminate\Database\Seeder;

class LeaveTypesTableSeeder extends Seeder
{
    public function run(): void
    {
        $leaveTypes = [
            [
                'name' => 'Yıllık Ücretli İzin',
                'is_paid' => true,
                'requires_document' => false,
                'max_duration_days' => null,
                'code' => 'YILLIK',
                'description' => 'İş Kanunu Madde 53 gereğince yıllık ücretli izin.',
            ],
            [
                'name' => 'Mazeret İznİ',
                'is_paid' => true,
                'requires_document' => true,
                'max_duration_days' => 7,
                'code' => 'MAZERET',
                'description' => 'Evlilik, doğum, ölüm gibi mazeretler için.',
            ],
            [
                'name' => 'Hastalık İzni',
                'is_paid' => false,
                'requires_document' => true,
                'max_duration_days' => 90,
                'code' => 'HASTALIK',
                'description' => 'Sağlık raporu ile belgelenen hastalık izni.',
            ],
            [
                'name' => 'Ücretsiz İzin',
                'is_paid' => false,
                'requires_document' => false,
                'max_duration_days' => 365,
                'code' => 'UCRETSIZ',
                'description' => 'Ücretsiz olarak verilen özel izin.',
            ],
            [
                'name' => 'Analık İzni',
                'is_paid' => true,
                'requires_document' => true,
                'max_duration_days' => 120,
                'code' => 'ANALIK',
                'description' => 'Doğum sonrası çalışan annelere verilen izin.',
            ],
            [
                'name' => 'Babalık İzni',
                'is_paid' => true,
                'requires_document' => true,
                'max_duration_days' => 10,
                'code' => 'BABALIK',
                'description' => 'Doğum sonrası çalışan babalara verilen izin.',
            ],
        ];

        foreach ($leaveTypes as $type) {
            LeaveType::create($type);
        }
    }
}
