<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\UserRoleEnum;
use App\Enums\UserStatusEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create or update admin user
        $existingUser = DB::table('users')->where('email', 'olgayaslandag@gmail.com')->first();

        if ($existingUser) {
            DB::table('users')->where('id', $existingUser->id)->update([
                'name' => 'Olgay Aslandağ',
                'password' => Hash::make('123123123'),
                'email_verified_at' => now(),
                'rank_id' => UserRoleEnum::ADMIN->value,
                'status_id' => UserStatusEnum::ACTIVE->value,
            ]);
        } else {
            DB::table('users')->insert([
                'name' => 'Olgay Aslandağ',
                'email' => 'olgayaslandag@gmail.com',
                'password' => Hash::make('123123123'),
                'email_verified_at' => now(),
                'rank_id' => UserRoleEnum::ADMIN->value,
                'status_id' => UserStatusEnum::ACTIVE->value,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Import all initial data from JSON files
        $this->call([
            PermissionSeeder::class,
            ImportAllDataSeeder::class,
            UserSeeder::class,
            EmployeeSeeder::class,
            LeaveTypesTableSeeder::class,
            LeaveEntitlementsSeeder::class,
            LeaveRequestsSeeder::class,
            SubmissionSeeder::class,
            PayrollSeeder::class,
            AdvanceRequestSeeder::class,
            \Database\Seeders\PDKS\PDKSSeeder::class,
        ]);
    }
}
