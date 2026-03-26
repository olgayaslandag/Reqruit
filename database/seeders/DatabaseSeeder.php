<?php

namespace Database\Seeders;

use App\Enums\UserRoleEnum;
use App\Enums\UserStatusEnum;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create or update admin user
        $user = User::updateOrCreate(
            ['email' => 'olgayaslandag@gmail.com'],
            [
                'name' => 'Olgay Aslandağ',
                'password' => Hash::make('123123123'),
                'email_verified_at' => now(),
                'rank_id' => UserRoleEnum::ADMIN->value,
                'status_id' => UserStatusEnum::ACTIVE->value,
            ]
        );

        // Import all initial data from JSON files
        $this->call([
            ImportAllDataSeeder::class,
            UserSeeder::class,
            EmployeeSeeder::class,
            SubmissionSeeder::class,
            PayrollSeeder::class,
            AdvanceRequestSeeder::class,
            \Database\Seeders\PDKS\PDKSSeeder::class,
        ]);
    }
}
