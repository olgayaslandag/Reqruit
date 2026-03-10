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

        // Seed other data
        $this->call([
            DepartmentSeeder::class,
            FormSeeder::class,
            FormFieldSeeder::class,
            SubmissionSeeder::class,
            SubmissionDetailSeeder::class,
            SubmissionCommentSeeder::class,
        ]);
    }
}
