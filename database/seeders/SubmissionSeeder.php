<?php

namespace Database\Seeders;

use App\Models\Submission;
use App\Models\SubmissionComment;
use App\Models\SubmissionDetail;
use App\Models\User;
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
        $detailsData = [];

        $fieldNames = ['ad_soyad', 'tc_kimlik', 'telefon', 'eposta', 'adres', 'basvuru_tarihi', 'pozisyon', 'departman'];
        $fieldLabels = ['Ad Soyad', 'TC Kimlik No', 'Telefon', 'E-posta', 'Adres', 'Başvuru Tarihi', 'Pozisyon', 'Departman'];

        $firstNames = ['Ahmet', 'Ayşe', 'Mehmet', 'Fatma', 'Ali', 'Burak', 'Cem', 'Deniz', 'Elif', 'Ferdi'];
        $lastNames = ['Yılmaz', 'Demir', 'Kaya', 'Şahin', 'Öztürk', 'Çelik', 'Erdoğan', 'Kurt', 'Özkan', 'Aydın'];

        foreach ($submissions as $submission) {
            // Add 3-6 details per submission
            $detailCount = rand(3, 6);

            for ($i = 0; $i < $detailCount; $i++) {
                $fieldIdx = array_rand($fieldNames);
                $fieldName = $fieldNames[$fieldIdx];
                $fieldLabel = $fieldLabels[$fieldIdx];

                $value = '';
                switch ($fieldName) {
                    case 'ad_soyad':
                        $value = $firstNames[array_rand($firstNames)].' '.$lastNames[array_rand($lastNames)];
                        break;
                    case 'tc_kimlik':
                        $value = str_pad(rand(10000000000, 99999999999), 11, '0', STR_PAD_LEFT);
                        break;
                    case 'telefon':
                        $value = '+90 5'.rand(30, 39).' '.rand(100, 999).' '.rand(1000, 9999);
                        break;
                    case 'eposta':
                        $value = strtolower($firstNames[array_rand($firstNames)].'.'.$lastNames[array_rand($lastNames)].'@mail.com');
                        break;
                    case 'adres':
                        $value = rand(1, 999).' '.['İstanbul', 'Ankara', 'İzmir'][array_rand(['İstanbul', 'Ankara', 'İzmir'])].' Türkiye';
                        break;
                    case 'basvuru_tarihi':
                        $value = now()->subDays(rand(1, 90))->format('Y-m-d');
                        break;
                    case 'pozisyon':
                        $value = ['Yazılım Geliştirici', 'Proje Yöneticisi', 'Satış Temsilcisi', 'Muhasebe Uzmanı'][array_rand(['Yazılım Geliştirici', 'Proje Yöneticisi', 'Satış Temsilcisi', 'Muhasebe Uzmanı'])];
                        break;
                    case 'departman':
                        $value = ['BT', 'İK', 'Satış', 'Muhasebe'][array_rand(['BT', 'İK', 'Satış', 'Muhasebe'])];
                        break;
                    default:
                        $value = 'Sample value '.rand(1, 100);
                }

                $detailsData[] = [
                    'submission_id' => $submission->id,
                    'field_name' => $fieldName,
                    'field_label' => $fieldLabel,
                    'field_value' => $value,
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

                $detailsData[] = [
                    'submission_id' => $submission->id,
                    'field_name' => $fieldName,
                    'field_label' => $fieldLabel,
                    'field_value' => $value,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        foreach (array_chunk($detailsData, 50) as $chunk) {
            SubmissionDetail::insert($chunk);
        }

        $this->command->info('Created '.count($detailsData).' submission details');
    }

    private function seedSubmissionComments(): void
    {
        $submissions = Submission::all();
        $users = User::pluck('id')->toArray();

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
            SubmissionComment::insert($chunk);
        }

        $this->command->info('Created '.count($commentsData).' submission comments');
    }
}
