<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FormFieldSeeder extends Seeder
{
    public function run(): void
    {
        $fields = [
            // Form 1: İş Başvuru
            ['form_id' => 1, 'label' => 'Ad Soyad', 'name' => 'name', 'type' => 'text', 'required' => 1, 'options' => null, 'sort_order' => 1],
            ['form_id' => 1, 'label' => 'E-posta', 'name' => 'email', 'type' => 'email', 'required' => 1, 'options' => null, 'sort_order' => 2],
            ['form_id' => 1, 'label' => 'Telefon', 'name' => 'telefon', 'type' => 'tel', 'required' => 1, 'options' => null, 'sort_order' => 3],
            ['form_id' => 1, 'label' => 'Pozisyon', 'name' => 'pozisyon', 'type' => 'select', 'required' => 1, 'options' => json_encode(['Yazılım Geliştirici', 'Proje Yöneticisi', 'Satış Temsilcisi', 'Muhasebeci', 'İK Uzmanı']), 'sort_order' => 4],
            ['form_id' => 1, 'label' => 'Özgeçmiş', 'name' => 'ozgecmis', 'type' => 'file', 'required' => 1, 'options' => json_encode(['pdf', 'doc', 'docx']), 'sort_order' => 5],

            // Form 2: Staj Başvuru
            ['form_id' => 2, 'label' => 'Ad Soyad', 'name' => 'name', 'type' => 'text', 'required' => 1, 'options' => null, 'sort_order' => 1],
            ['form_id' => 2, 'label' => 'E-posta', 'name' => 'email', 'type' => 'email', 'required' => 1, 'options' => null, 'sort_order' => 2],
            ['form_id' => 2, 'label' => 'Okul', 'name' => 'okul', 'type' => 'text', 'required' => 1, 'options' => null, 'sort_order' => 3],
            ['form_id' => 2, 'label' => 'Bölüm', 'name' => 'bolum', 'type' => 'text', 'required' => 1, 'options' => null, 'sort_order' => 4],
            ['form_id' => 2, 'label' => 'Sınıf', 'name' => 'sinif', 'type' => 'select', 'required' => 1, 'options' => json_encode(['1. Sınıf', '2. Sınıf', '3. Sınıf', '4. Sınıf']), 'sort_order' => 5],
            ['form_id' => 2, 'label' => 'Staj Dönemi', 'name' => 'donem', 'type' => 'select', 'required' => 1, 'options' => json_encode(['Yaz Dönemi', 'Güz Dönemi', 'Bahar Dönemi']), 'sort_order' => 6],

            // Form 3: BT Destek
            ['form_id' => 3, 'label' => 'Ad Soyad', 'name' => 'name', 'type' => 'text', 'required' => 1, 'options' => null, 'sort_order' => 1],
            ['form_id' => 3, 'label' => 'E-posta', 'name' => 'email', 'type' => 'email', 'required' => 1, 'options' => null, 'sort_order' => 2],
            ['form_id' => 3, 'label' => 'Birim', 'name' => 'birim', 'type' => 'text', 'required' => 1, 'options' => null, 'sort_order' => 3],
            ['form_id' => 3, 'label' => 'Sorun Türü', 'name' => 'sorun_turu', 'type' => 'select', 'required' => 1, 'options' => json_encode(['Donanım', 'Yazılım', 'Ağ', 'E-posta', 'Diğer']), 'sort_order' => 4],
            ['form_id' => 3, 'label' => 'Açıklama', 'name' => 'aciklama', 'type' => 'textarea', 'required' => 1, 'options' => null, 'sort_order' => 5],
            ['form_id' => 3, 'label' => 'Ekran Görüntüsü', 'name' => 'goruntu', 'type' => 'file', 'required' => 0, 'options' => json_encode(['jpg', 'png', 'pdf']), 'sort_order' => 6],

            // Form 4: Yazılım Talebi
            ['form_id' => 4, 'label' => 'Ad Soyad', 'name' => 'name', 'type' => 'text', 'required' => 1, 'options' => null, 'sort_order' => 1],
            ['form_id' => 4, 'label' => 'E-posta', 'name' => 'email', 'type' => 'email', 'required' => 1, 'options' => null, 'sort_order' => 2],
            ['form_id' => 4, 'label' => 'Proje Adı', 'name' => 'proje_adi', 'type' => 'text', 'required' => 1, 'options' => null, 'sort_order' => 3],
            ['form_id' => 4, 'label' => 'Öncelik', 'name' => 'oncelik', 'type' => 'select', 'required' => 1, 'options' => json_encode(['Düşük', 'Orta', 'Yüksek', 'Kritik']), 'sort_order' => 4],
            ['form_id' => 4, 'label' => 'Talep Detayı', 'name' => 'detay', 'type' => 'textarea', 'required' => 1, 'options' => null, 'sort_order' => 5],
            ['form_id' => 4, 'label' => 'Bütçe', 'name' => 'butce', 'type' => 'number', 'required' => 0, 'options' => null, 'sort_order' => 6],

            // Form 5: Müşteri Şikayet
            ['form_id' => 5, 'label' => 'Ad Soyad', 'name' => 'name', 'type' => 'text', 'required' => 1, 'options' => null, 'sort_order' => 1],
            ['form_id' => 5, 'label' => 'E-posta', 'name' => 'email', 'type' => 'email', 'required' => 1, 'options' => null, 'sort_order' => 2],
            ['form_id' => 5, 'label' => 'Telefon', 'name' => 'telefon', 'type' => 'tel', 'required' => 1, 'options' => null, 'sort_order' => 3],
            ['form_id' => 5, 'label' => 'Şikayet Konusu', 'name' => 'konu', 'type' => 'select', 'required' => 1, 'options' => json_encode(['Ürün Kalitesi', 'Müşteri Hizmetleri', 'Teslimat', 'Fatura', 'Diğer']), 'sort_order' => 4],
            ['form_id' => 5, 'label' => 'Şikayet Detayı', 'name' => 'detay', 'type' => 'textarea', 'required' => 1, 'options' => null, 'sort_order' => 5],

            // Form 6: Müşteri Öneri
            ['form_id' => 6, 'label' => 'Ad Soyad', 'name' => 'name', 'type' => 'text', 'required' => 0, 'options' => null, 'sort_order' => 1],
            ['form_id' => 6, 'label' => 'E-posta', 'name' => 'email', 'type' => 'email', 'required' => 0, 'options' => null, 'sort_order' => 2],
            ['form_id' => 6, 'label' => 'Öneri Konusu', 'name' => 'konu', 'type' => 'text', 'required' => 1, 'options' => null, 'sort_order' => 3],
            ['form_id' => 6, 'label' => 'Öneriniz', 'name' => 'oneri', 'type' => 'textarea', 'required' => 1, 'options' => null, 'sort_order' => 4],

            // Form 7: Fatura Ödeme
            ['form_id' => 7, 'label' => 'Ad Soyad', 'name' => 'name', 'type' => 'text', 'required' => 1, 'options' => null, 'sort_order' => 1],
            ['form_id' => 7, 'label' => 'E-posta', 'name' => 'email', 'type' => 'email', 'required' => 1, 'options' => null, 'sort_order' => 2],
            ['form_id' => 7, 'label' => 'Fatura No', 'name' => 'fatura_no', 'type' => 'text', 'required' => 1, 'options' => null, 'sort_order' => 3],
            ['form_id' => 7, 'label' => 'Fatura Tutarı', 'name' => 'tutar', 'type' => 'number', 'required' => 1, 'options' => null, 'sort_order' => 4],
            ['form_id' => 7, 'label' => 'Vade Talebi', 'name' => 'vade', 'type' => 'select', 'required' => 1, 'options' => json_encode(['Peşin', '30 Gün', '60 Gün', '90 Gün']), 'sort_order' => 5],
            ['form_id' => 7, 'label' => 'Açıklama', 'name' => 'aciklama', 'type' => 'textarea', 'required' => 0, 'options' => null, 'sort_order' => 6],

            // Form 8: Bayilik
            ['form_id' => 8, 'label' => 'Ad Soyad', 'name' => 'name', 'type' => 'text', 'required' => 1, 'options' => null, 'sort_order' => 1],
            ['form_id' => 8, 'label' => 'E-posta', 'name' => 'email', 'type' => 'email', 'required' => 1, 'options' => null, 'sort_order' => 2],
            ['form_id' => 8, 'label' => 'Firma Adı', 'name' => 'firma_adi', 'type' => 'text', 'required' => 1, 'options' => null, 'sort_order' => 3],
            ['form_id' => 8, 'label' => 'Telefon', 'name' => 'telefon', 'type' => 'tel', 'required' => 1, 'options' => null, 'sort_order' => 4],
            ['form_id' => 8, 'label' => 'İl', 'name' => 'il', 'type' => 'select', 'required' => 1, 'options' => json_encode(['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Diğer']), 'sort_order' => 5],
            ['form_id' => 8, 'label' => 'Bayilik Türü', 'name' => 'bayilik_turu', 'type' => 'select', 'required' => 1, 'options' => json_encode(['Gold', 'Silver', 'Bronze']), 'sort_order' => 6],
            ['form_id' => 8, 'label' => 'Faaliyet Belgesi', 'name' => 'belge', 'type' => 'file', 'required' => 0, 'options' => json_encode(['pdf', 'jpg', 'png']), 'sort_order' => 7],

            // Form 9: İzin Talebi
            ['form_id' => 9, 'label' => 'Ad Soyad', 'name' => 'name', 'type' => 'text', 'required' => 1, 'options' => null, 'sort_order' => 1],
            ['form_id' => 9, 'label' => 'E-posta', 'name' => 'email', 'type' => 'email', 'required' => 1, 'options' => null, 'sort_order' => 2],
            ['form_id' => 9, 'label' => 'Personel No', 'name' => 'personel_no', 'type' => 'text', 'required' => 1, 'options' => null, 'sort_order' => 3],
            ['form_id' => 9, 'label' => 'İzin Türü', 'name' => 'izin_turu', 'type' => 'select', 'required' => 1, 'options' => json_encode(['Yıllık İzin', 'Sağlık İzni', 'Mazeret İzni', 'Doğum İzni', 'Babalık İzni']), 'sort_order' => 4],
            ['form_id' => 9, 'label' => 'Başlangıç Tarihi', 'name' => 'baslangic', 'type' => 'date', 'required' => 1, 'options' => null, 'sort_order' => 5],
            ['form_id' => 9, 'label' => 'Bitiş Tarihi', 'name' => 'bitis', 'type' => 'date', 'required' => 1, 'options' => null, 'sort_order' => 6],
            ['form_id' => 9, 'label' => 'Açıklama', 'name' => 'aciklama', 'type' => 'textarea', 'required' => 0, 'options' => null, 'sort_order' => 7],

            // Form 10: Eğitim Talebi
            ['form_id' => 10, 'label' => 'Ad Soyad', 'name' => 'name', 'type' => 'text', 'required' => 1, 'options' => null, 'sort_order' => 1],
            ['form_id' => 10, 'label' => 'E-posta', 'name' => 'email', 'type' => 'email', 'required' => 1, 'options' => null, 'sort_order' => 2],
            ['form_id' => 10, 'label' => 'Birim', 'name' => 'birim', 'type' => 'text', 'required' => 1, 'options' => null, 'sort_order' => 3],
            ['form_id' => 10, 'label' => 'Eğitim Konusu', 'name' => 'konu', 'type' => 'text', 'required' => 1, 'options' => null, 'sort_order' => 4],
            ['form_id' => 10, 'label' => 'Eğitim Türü', 'name' => 'egitim_turu', 'type' => 'select', 'required' => 1, 'options' => json_encode(['Teknik Eğitim', 'Yönetim Eğitimi', 'Kişisel Gelişim', 'Dil Eğitimi']), 'sort_order' => 5],
            ['form_id' => 10, 'label' => 'Katılımcı Sayısı', 'name' => 'kisi_sayisi', 'type' => 'number', 'required' => 1, 'options' => null, 'sort_order' => 6],
            ['form_id' => 10, 'label' => 'Öncelik Durumu', 'name' => 'oncelik', 'type' => 'select', 'required' => 1, 'options' => json_encode(['Acil', 'Normal', 'Ertelenebilir']), 'sort_order' => 7],
        ];

        foreach ($fields as $field) {
            DB::table('form_fields')->updateOrInsert(
                ['form_id' => $field['form_id'], 'name' => $field['name']],
                $field + ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}
