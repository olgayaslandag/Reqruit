<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CandidateSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedCandidates();
        $this->seedInteractions();
    }

    private function seedCandidates(): void
    {
        $users = DB::table('users')->pluck('id')->toArray();
        $createdBy = $users[0] ?? null;

        $statuses = ['active', 'engaged', 'passive', 'closed'];
        $firstNames = ['Ahmet', 'Ayşe', 'Mehmet', 'Fatma', 'Ali', 'Burak', 'Cem', 'Deniz', 'Elif', 'Ferdi', 'Gizem', 'Hakan'];
        $lastNames = ['Yılmaz', 'Demir', 'Kaya', 'Şahin', 'Öztürk', 'Çelik', 'Erdoğan', 'Kurt', 'Özkan', 'Aydın'];
        $employers = ['ABC Holding', 'XYZ Teknoloji', 'Mega Yapı', 'Nova Bilişim', 'Delta Lojistik', 'Polar Gıda', 'Sky Mühendislik'];
        $positions = ['Proje Yöneticisi', 'Satış Müdürü', 'Bilgisayar Mühendisi', 'İç Mimar', 'Muhasebe Uzmanı', 'Grafik Tasarımcı', 'İş Geliştirme Uzmanı'];
        $sources = ['Referans', 'LinkedIn', 'Fuarlar', 'Eski Çalışan', 'Sosyal Medya', 'Kariyer Sitesi', 'Tavsiye'];

        $candidatesData = [];

        for ($i = 0; $i < 40; $i++) {
            $daysAgo = rand(5, 365);
            $createdAt = now()->subDays($daysAgo);

            $candidatesData[] = [
                'name' => $firstNames[array_rand($firstNames)].' '.$lastNames[array_rand($lastNames)],
                'email' => strtolower($firstNames[rand(0, count($firstNames) - 1)].'.'.$lastNames[rand(0, count($lastNames) - 1)].'@mail.com'),
                'phone' => '+90 5'.rand(30, 39).' '.rand(100, 999).' '.rand(1000, 9999),
                'current_employer' => $employers[array_rand($employers)],
                'current_position' => $positions[array_rand($positions)],
                'source' => $sources[array_rand($sources)],
                'status' => $statuses[array_rand($statuses)],
                'notes' => 'Kalifiye eleman havuzuna eklendi. Uygun pozisyon açıldığında değerlendirilecek.',
                'created_by' => $createdBy,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ];
        }

        foreach (array_chunk($candidatesData, 50) as $chunk) {
            DB::table('candidates')->insert($chunk);
        }

        $this->command->info('Created '.count($candidatesData).' qualified candidates');
    }

    private function seedInteractions(): void
    {
        $candidates = DB::table('candidates')->get();
        $users = DB::table('users')->pluck('id')->toArray();
        $createdBy = $users[0] ?? null;

        $types = ['meeting', 'phone', 'email', 'offer', 'negotiation', 'other'];
        $descriptions = [
            'İlk tanışma görüşmesi yapıldı, aday ilgili.',
            'Detaylı mülakat yapıldı, yetkinlikler yerinde.',
            'Şirket tanıtımı yapıldı, aday olumlu yaklaştı.',
            'Teknik görüşme yapıldı, tecrübe güçlü.',
            'Telefonla görüşüldü, maaş beklentisi alındı.',
            'E-posta ile güncel özgeçmişi talep edildi.',
            'Pozisyon için teklif yapıldı, geri dönüş bekleniyor.',
            'Gelecekteki pozisyon için iletişim sürdürülüyor.',
        ];
        $responses = [
            'Şu anda mevcut işinde devam etmekte, sene sonuna kadar beklemede.',
            'Teklifi değerlendiriyor, kısa sürede dönüş yapacak.',
            'Pozisyonu kabul etti, başlangıç tarihi görüşülecek.',
            'Maaş beklentisi yüksek, pazarlık sürüyor.',
            'Yeni işiyle devam etmeye karar verdi, pasife alındı.',
        ];

        $interactionsData = [];

        foreach ($candidates as $candidate) {
            $interactionCount = rand(1, 4);

            for ($i = 0; $i < $interactionCount; $i++) {
                $daysAgo = rand(1, 180);
                $createdAt = now()->subDays($daysAgo);

                $interactionsData[] = [
                    'candidate_id' => $candidate->id,
                    'submission_id' => null,
                    'interaction_type' => $types[array_rand($types)],
                    'interaction_date' => $createdAt->format('Y-m-d'),
                    'description' => $descriptions[array_rand($descriptions)],
                    'response' => $responses[array_rand($responses)],
                    'created_by' => $createdBy,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ];
            }
        }

        foreach (array_chunk($interactionsData, 50) as $chunk) {
            DB::table('contact_interactions')->insert($chunk);
        }

        $this->command->info('Created '.count($interactionsData).' candidate interactions');
    }
}