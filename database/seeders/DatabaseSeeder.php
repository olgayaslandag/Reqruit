<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles and permissions first
        $this->call([
            RolesAndPermissionsSeeder::class,
        ]);

        // Create or update admin user
        $user = User::updateOrCreate(
            ['email' => 'olgayaslandag@gmail.com'],
            [
                'name' => 'Olgay Aslandağ',
                'password' => Hash::make('123123123'),
                'email_verified_at' => now(),
            ]
        );

        // Assign super_admin role to the user
        $user->assignRole('super_admin');

        // Seed other data
        $this->call([
            DepartmentSeeder::class,
            FormSeeder::class,
            FormFieldSeeder::class,
            SubmissionSeeder::class,
        ]);
    }
}
