<?php

namespace Database\Seeders;

use App\Enums\UserRoleEnum;
use App\Enums\UserStatusEnum;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $roles = UserRoleEnum::cases();
        $statuses = UserStatusEnum::cases();

        $firstNames = [
            'Ahmet', 'Ayşe', 'Mehmet', 'Fatma', 'Ali', 'Ayşe', 'Burak', 'Cem', 'Deniz', 'Elif',
            'Ferdi', 'Gizem', 'Hakan', 'İpek', 'Kaan', 'Lale', 'Mert', 'Nesrin', 'Onur', 'Pınar',
            'Rıza', 'Sevda', 'Tolga', 'Umut', 'Vildan', 'Yasin', 'Zeynep', 'Barış', 'Can', 'Derya',
            'Eren', 'Funda', 'Gökhan', 'Hilal', 'İrem', 'Kadir', 'Leyla', 'Murat', 'Nermin', 'Orhan',
        ];

        $lastNames = [
            'Yılmaz', 'Demir', 'Kaya', 'Şahin', 'Öztürk', 'Çelik', 'Erdoğan', 'Kurt', 'Özkan', 'Aydın',
            'Aktaş', 'Arslan', 'Baran', 'Bektaş', 'Bulut', 'Çakır', 'Çetin', 'Doğan', 'Erdem', 'Eroğlu',
            'Güneş', 'Karaca', 'Karahan', 'Köseoğlu', 'Metin', 'Mutlu', 'Nalbantoğlu', 'Oral', 'Özdemir', 'Sayar',
            'Sezen', 'Tan', 'Tekin', 'Turan', 'Uçar', 'Yavuz', 'Yıldız', 'Yücel', 'Zorlu', 'Sert',
        ];

        $departments = [
            'Bilgi Teknolojileri',
            'İnsan Kaynakları',
            'Proje Yönetimi',
            'Muhasebe',
            'Satış',
            'Pazarlama',
            'Üretim',
            'Müşteri Hizmetleri',
            'Ar-Ge',
            'Finans',
        ];

        $users = [];
        $now = now();

        // Admin users (5)
        for ($i = 0; $i < 5; $i++) {
            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];
            $users[] = [
                'name' => "$firstName $lastName",
                'email' => strtolower("$firstName.$lastName".($i > 0 ? $i : '')).'@company.com',
                'password' => Hash::make('123123123'),
                'rank_id' => UserRoleEnum::ADMIN->value,
                'status_id' => UserStatusEnum::ACTIVE->value,
                'email_verified_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // IK Managers (15)
        for ($i = 0; $i < 15; $i++) {
            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];
            $dept = $departments[array_rand($departments)];
            $users[] = [
                'name' => "$firstName $lastName",
                'email' => strtolower("ik.$firstName.$lastName".($i > 0 ? $i : '')).'@company.com',
                'password' => Hash::make('123123123'),
                'rank_id' => UserRoleEnum::IK_MANAGER->value,
                'status_id' => UserStatusEnum::ACTIVE->value,
                'email_verified_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // Recruiters (30)
        for ($i = 0; $i < 30; $i++) {
            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];
            $status = $i < 25 ? UserStatusEnum::ACTIVE : ($i < 28 ? UserStatusEnum::INACTIVE : UserStatusEnum::PENDING);
            $users[] = [
                'name' => "$firstName $lastName",
                'email' => strtolower("recruiter.$firstName.$lastName".($i > 0 ? $i : '')).'@company.com',
                'password' => Hash::make('123123123'),
                'rank_id' => UserRoleEnum::RECRUITER->value,
                'status_id' => $status->value,
                'email_verified_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // Department Heads (50)
        for ($i = 0; $i < 50; $i++) {
            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];
            $users[] = [
                'name' => "$firstName $lastName",
                'email' => strtolower("dh.$firstName.$lastName".($i > 0 ? $i : '')).'@company.com',
                'password' => Hash::make('123123123'),
                'rank_id' => UserRoleEnum::DEPARTMENT_HEAD->value,
                'status_id' => UserStatusEnum::ACTIVE->value,
                'email_verified_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // Observers (100+)
        for ($i = 0; $i < 110; $i++) {
            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];
            $status = $i < 100 ? UserStatusEnum::ACTIVE : UserStatusEnum::INACTIVE;
            $users[] = [
                'name' => "$firstName $lastName",
                'email' => strtolower("observer.$firstName.$lastName".($i > 0 ? $i : '')).'@company.com',
                'password' => Hash::make('123123123'),
                'rank_id' => UserRoleEnum::OBSERVER->value,
                'status_id' => $status->value,
                'email_verified_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // Bulk insert
        foreach (array_chunk($users, 50) as $chunk) {
            User::insertOrIgnore($chunk);
        }

        $this->command->info('Created '.count($users).' users');
    }
}
