<?php

namespace Database\Seeders;

use App\Models\Submission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SubmissionSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedSubmissions();
    }

    private function seedSubmissions(): void
    {
        $forms = \DB::table('forms')->pluck('id')->toArray();

        if (empty($forms)) {
            $this->command->warn('No forms found. Run ImportAllDataSeeder first.');

            return;
        }

        $statuses = ['new', 'reviewing', 'interview', 'offer', 'hired', 'rejected'];
        $investigations = ['none', 'pending', 'completed'];

        $firstNames = [
            'Ahmet', 'Ayşe', 'Mehmet', 'Fatma', 'Ali', 'Burak', 'Cem', 'Deniz', 'Elif', 'Ferdi',
            'Gizem', 'Hakan', 'İpek', 'Kaan', 'Lale', 'Mert', 'Nesrin', 'Onur', 'Pınar', 'Rıza',
        ];

        $lastNames = [
            'Yılmaz', 'Demir', 'Kaya', 'Şahin', 'Öztürk', 'Çelik', 'Erdoğan', 'Kurt', 'Özkan', 'Aydın',
            'Aktaş', 'Arslan', 'Baran', 'Bektaş', 'Bulut', 'Çakır', 'Çetin', 'Doğan', 'Erdem', 'Eroğlu',
        ];

        $submissionsData = [];

        // Create 200+ submissions
        for ($i = 0; $i < 220; $i++) {
            $formId = $forms[array_rand($forms)];
            $status = $statuses[array_rand($statuses)];
            $investigation = $status === 'completed' ? $investigations[array_rand($investigations)] : 'none';

            // Random date within last 6 months
            $daysAgo = rand(0, 180);
            $createdAt = now()->subDays($daysAgo);

            $submissionsData[] = [
                'form_id' => $formId,
                'reference_no' => 'APP-'.strtoupper(Str::random(8)),
                'status' => $status,
                'investigation' => $investigation,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ];
        }

        // Bulk insert
        foreach (array_chunk($submissionsData, 50) as $chunk) {
            \DB::table('submissions')->insert($chunk);
        }

        $this->command->info('Created '.count($submissionsData).' submissions');

        // Add submission details
        $this->seedSubmissionDetails();

        // Add submission comments
        $this->seedSubmissionComments();
    }

    private function seedSubmissionDetails(): void
    {
        $submissions = \DB::table('submissions')->get();

        // Clear existing details to avoid duplicates
        \DB::table('submission_details')->truncate();

        $detailsData = [];

        // Name fields (always added first, never randomly)
        $nameFields = ['ad_soyad', 'name', 'full_name', 'name_surname', 'namesurname', 'isim'];

        // Other fields that can be randomly added
        $otherFields = [
            'tc_kimlik', 'telefon', 'eposta', 'e-posta', 'e_posta', 'email', 'mail',
            'adres', 'basvuru_tarihi', 'pozisyon', 'departman', 'dogum_tarihi',
            'cinsiyet', 'medeni_hal', 'cocuk_sayisi', 'askerlik_durumu',
            'surucu_belgesi', 'dogum_yeri', 'egitim_durumu', 'mezuniyet_derecesi',
            'yabanci_dil', 'ise_baslayabileceginiz_tarih', 'maas_beklentisi',
            'referans', 'ozgecmis', 'notlar',
        ];

        $firstNames = ['Ahmet', 'Ayşe', 'Mehmet', 'Fatma', 'Ali', 'Burak', 'Cem', 'Deniz', 'Elif', 'Ferdi'];
        $lastNames = ['Yılmaz', 'Demir', 'Kaya', 'Şahin', 'Öztürk', 'Çelik', 'Erdoğan', 'Kurt', 'Özkan', 'Aydın'];

        $fieldGenerators = [
            'tc_kimlik' => fn () => str_pad(rand(10000000000, 99999999999), 11, '0', STR_PAD_LEFT),
            'telefon' => fn () => '+90 5'.rand(30, 39).' '.rand(100, 999).' '.rand(1000, 9999),
            'eposta' => fn () => strtolower($firstNames[array_rand($firstNames)].'.'.$lastNames[array_rand($lastNames)].'@mail.com'),
            'e-posta' => fn () => strtolower($firstNames[array_rand($firstNames)].'.'.$lastNames[array_rand($lastNames)].'@mail.com'),
            'e_posta' => fn () => strtolower($firstNames[array_rand($firstNames)].'.'.$lastNames[array_rand($lastNames)].'@mail.com'),
            'email' => fn () => strtolower($firstNames[array_rand($firstNames)].'.'.$lastNames[array_rand($lastNames)].'@mail.com'),
            'mail' => fn () => strtolower($firstNames[array_rand($firstNames)].'.'.$lastNames[array_rand($lastNames)].'@mail.com'),
            'adres' => fn () => rand(1, 999).' '.['İstanbul', 'Ankara', 'İzmir'][array_rand(['İstanbul', 'Ankara', 'İzmir'])].' Türkiye',
            'basvuru_tarihi' => fn () => now()->subDays(rand(1, 90))->format('Y-m-d'),
            'pozisyon' => fn () => ['Yazılım Geliştirici', 'Proje Yöneticisi', 'Satış Temsilcisi', 'Muhasebe Uzmanı'][array_rand(['Yazılım Geliştirici', 'Proje Yöneticisi', 'Satış Temsilcisi', 'Muhasebe Uzmanı'])],
            'departman' => fn () => ['BT', 'İK', 'Satış', 'Muhasebe'][array_rand(['BT', 'İK', 'Satış', 'Muhasebe'])],
            'dogum_tarihi' => fn () => rand(1980, 2000).'-'.rand(1, 12).'-'.rand(1, 28),
            'cinsiyet' => fn () => ['Erkek', 'Kadın'][array_rand(['Erkek', 'Kadın'])],
            'medeni_hal' => fn () => ['Bekar', 'Evli'][array_rand(['Bekar', 'Evli'])],
            'cocuk_sayisi' => fn () => (string) rand(0, 4),
            'askerlik_durumu' => fn () => ['Yaptı', 'Yapmadı', 'Muaf', 'Tecilli'][array_rand(['Yaptı', 'Yapmadı', 'Muaf', 'Tecilli'])],
            'surucu_belgesi' => fn () => ['B Sınıfı', 'A Sınıfı', 'Yok'][array_rand(['B Sınıfı', 'A Sınıfı', 'Yok'])],
            'dogum_yeri' => fn () => ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'][array_rand(['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'])],
            'egitim_durumu' => fn () => ['Lise', 'Ön Lisans', 'Lisans', 'Yüksek Lisans', 'Doktora'][array_rand(['Lise', 'Ön Lisans', 'Lisans', 'Yüksek Lisans', 'Doktora'])],
            'mezuniyet_derecesi' => fn () => (string) rand(2.0, 4.0),
            'yabanci_dil' => fn () => ['İngilizce', 'Almanca', 'Fransızca', 'İspanyolca'][array_rand(['İngilizce', 'Almanca', 'Fransızca', 'İspanyolca'])],
            'ise_baslayabileceginiz_tarih' => fn () => now()->addDays(rand(1, 30))->format('Y-m-d'),
            'maas_beklentisi' => fn () => (string) (rand(15, 60) * 1000),
            'referans' => fn () => $firstNames[array_rand($firstNames)].' '.$lastNames[array_rand($lastNames)],
            'ozgecmis' => fn () => 'Özgeçmiş bilgisi...',
            'notlar' => fn () => 'Ek not bilgisi...',
        ];

        $fieldLabels = [
            'ad_soyad' => 'Ad Soyad', 'name' => 'Ad Soyad', 'full_name' => 'Ad Soyad',
            'name_surname' => 'Ad Soyad', 'namesurname' => 'Ad Soyad', 'isim' => 'İsim',
            'tc_kimlik' => 'TC Kimlik No', 'telefon' => 'Telefon', 'eposta' => 'E-posta',
            'e-posta' => 'E-posta', 'e_posta' => 'E-posta', 'email' => 'E-posta', 'mail' => 'E-posta',
            'adres' => 'Adres', 'basvuru_tarihi' => 'Başvuru Tarihi', 'pozisyon' => 'Pozisyon',
            'departman' => 'Departman', 'dogum_tarihi' => 'Doğum Tarihi', 'cinsiyet' => 'Cinsiyet',
            'medeni_hal' => 'Medeni Hal', 'cocuk_sayisi' => 'Çocuk Sayısı', 'askerlik_durumu' => 'Askerlik Durumu',
            'surucu_belgesi' => 'Sürücü Belgesi', 'dogum_yeri' => 'Doğum Yeri', 'egitim_durumu' => 'Eğitim Durumu',
            'mezuniyet_derecesi' => 'Mezuniyet Derecesi', 'yabanci_dil' => 'Yabancı Dil',
            'ise_baslayabileceginiz_tarih' => 'İşe Başlama Tarihi', 'maas_beklentisi' => 'Maaş Beklentisi',
            'referans' => 'Referans', 'ozgecmis' => 'Özgeçmiş', 'notlar' => 'Notlar',
        ];

        foreach ($submissions as $submission) {
            // Add 5-8 details per submission
            $detailCount = rand(5, 8);

            // Always include a name field
            $nameField = $nameFields[array_rand($nameFields)];
            $nameValue = $firstNames[array_rand($firstNames)].' '.$lastNames[array_rand($lastNames)];

            $detailsData[] = [
                'submission_id' => $submission->id,
                'field_name' => $nameField,
                'field_label' => $fieldLabels[$nameField],
                'field_value' => $nameValue,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Add other details (skip name fields)
            $addedFields = [$nameField];
            for ($i = 1; $i < $detailCount; $i++) {
                $fieldName = $otherFields[array_rand($otherFields)];

                // Skip if already added
                if (in_array($fieldName, $addedFields)) {
                    continue;
                }
                $addedFields[] = $fieldName;

                $generator = $fieldGenerators[$fieldName] ?? fn () => '';

                $detailsData[] = [
                    'submission_id' => $submission->id,
                    'field_name' => $fieldName,
                    'field_label' => $fieldLabels[$fieldName] ?? ucfirst($fieldName),
                    'field_value' => $generator(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        foreach (array_chunk($detailsData, 50) as $chunk) {
            \DB::table('submission_details')->insert($chunk);
        }

        $this->command->info('Created '.count($detailsData).' submission details');
    }

    private function seedSubmissionComments(): void
    {
        $submissions = \DB::table('submissions')->get();
        $users = \DB::table('users')->pluck('id')->toArray();

        if (empty($users)) {
            $users = [1];
        }

        $commentsData = [];

        foreach ($submissions as $submission) {
            // Add 0-3 comments per submission
            $commentCount = rand(0, 3);

            for ($i = 0; $i < $commentCount; $i++) {
                $daysAgo = rand(1, 30);
                $createdAt = now()->subDays($daysAgo);

                $commentTexts = [
                    'Başvuru incelendi, uygun bulundu.',
                    'Dosya eksik bilgi içeriyor, tamamlanması gerekiyor.',
                    'Mülakat randevusu ayarlandı.',
                    'Referans kontrolü yapıldı.',
                    'İş teklifi gönderildi.',
                    'Aday işe başladı.',
                    'Başvuru reddedildi.',
                    'Daha fazla bilgi gerekiyor.',
                    'Pozisyon için uygun değil.',
                    'Yedek aday olarak listeye eklendi.',
                ];

                $commentsData[] = [
                    'submission_id' => $submission->id,
                    'user_id' => $users[array_rand($users)],
                    'comment' => $commentTexts[array_rand($commentTexts)],
                    'rating' => rand(1, 5),
                    'is_private' => rand(0, 1),
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ];
            }
        }

        foreach (array_chunk($commentsData, 50) as $chunk) {
            \DB::table('submission_comments')->insert($chunk);
        }

        $this->command->info('Created '.count($commentsData).' submission comments');
    }
}
