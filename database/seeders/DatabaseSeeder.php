<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->updateOrInsert(
            [
                'name' => 'Olgay Aslandağ',
                'email' => 'olgayaslandag@gmail.com',
                'password' => Hash::make('123123123'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

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
