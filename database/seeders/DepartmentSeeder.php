<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['id' => 1, 'title' => 'İnsan Kaynakları', 'slug' => 'insan-kaynaklari', 'emails' => json_encode(['ik@şirket.com']), 'parent_id' => null],
            ['id' => 2, 'title' => 'Bilgi Teknolojileri', 'slug' => 'bilgi-teknolojileri', 'emails' => json_encode(['bt@şirket.com']), 'parent_id' => null],
            ['id' => 3, 'title' => 'Müşteri Hizmetleri', 'slug' => 'musteri-hizmetleri', 'emails' => json_encode(['musteri@şirket.com']), 'parent_id' => null],
            ['id' => 4, 'title' => 'Finans', 'slug' => 'finans', 'emails' => json_encode(['finans@şirket.com']), 'parent_id' => null],
            ['id' => 5, 'title' => 'Satış', 'slug' => 'satis', 'emails' => json_encode(['satis@şirket.com']), 'parent_id' => null],
            ['id' => 6, 'title' => 'İdari İşler', 'slug' => 'idari-isler', 'emails' => json_encode(['idari@şirket.com']), 'parent_id' => null],
            ['id' => 7, 'title' => 'Eğitim', 'slug' => 'egitim', 'emails' => json_encode(['egitim@şirket.com']), 'parent_id' => 1],
            ['id' => 8, 'title' => 'Kariyer Geliştirme', 'slug' => 'kariyer-gelistirme', 'emails' => json_encode(['kariyer@şirket.com']), 'parent_id' => 1],
        ];

        foreach ($departments as $department) {
            DB::table('departments')->updateOrInsert(
                ['id' => $department['id']],
                $department + ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}
