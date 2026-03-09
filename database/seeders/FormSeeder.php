<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FormSeeder extends Seeder
{
    public function run(): void
    {
        $forms = [
            ['id' => 1, 'department_id' => 1, 'name' => 'İş Başvuru Formu', 'description' => 'Kariyer sayfamızdan gelen iş başvuruları için', 'slug' => 'is-basvuru', 'notification_emails' => json_encode(['insan-kaynaklari@sirket.com', 'pelin@sirket.com'])],
            ['id' => 2, 'department_id' => 1, 'name' => 'Staj Başvuru Formu', 'description' => 'Öğrenci staj başvuruları için', 'slug' => 'staj-basvuru', 'notification_emails' => json_encode(['staj@sirket.com'])],
            ['id' => 3, 'department_id' => 2, 'name' => 'BT Destek Talebi', 'description' => 'Teknik destek ve arıza bildirimi', 'slug' => 'bt-destek', 'notification_emails' => json_encode(['bt-destek@sirket.com'])],
            ['id' => 4, 'department_id' => 2, 'name' => 'Yazılım Geliştirme Talebi', 'description' => 'Yeni yazılım veya özellik talepleri', 'slug' => 'yazilim-talebi', 'notification_emails' => null],
            ['id' => 5, 'department_id' => 3, 'name' => 'Müşteri Şikayet Formu', 'description' => 'Müşteri memnuniyeti için şikayetler', 'slug' => 'musteri-sikayet', 'notification_emails' => json_encode(['musteri-hizmetleri@sirket.com'])],
            ['id' => 6, 'department_id' => 3, 'name' => 'Müşteri Öneri Formu', 'description' => 'Müşteri önerileri ve geri bildirimler', 'slug' => 'musteri-oneri', 'notification_emails' => null],
            ['id' => 7, 'department_id' => 4, 'name' => 'Fatura Ödeme Talebi', 'description' => 'Fatura ödeme planı talepleri', 'slug' => 'fatura-odeme', 'notification_emails' => null],
            ['id' => 8, 'department_id' => 5, 'name' => 'Bayilik Başvuru Formu', 'description' => 'Bayilik talepleri için', 'slug' => 'bayilik-basvuru', 'notification_emails' => json_encode(['bayilik@sirket.com', 'satis@sirket.com'])],
            ['id' => 9, 'department_id' => 6, 'name' => 'İzin Talep Formu', 'description' => 'Çalışan izin talepleri', 'slug' => 'izin-talebi', 'notification_emails' => json_encode(['insan-kaynaklari@sirket.com'])],
            ['id' => 10, 'department_id' => 7, 'name' => 'Eğitim Talep Formu', 'description' => 'Kurumsal eğitim talepleri', 'slug' => 'egitim-talebi', 'notification_emails' => null],
        ];

        foreach ($forms as $form) {
            DB::table('forms')->updateOrInsert(
                ['id' => $form['id']],
                $form + ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}
