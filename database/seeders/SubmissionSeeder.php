<?php

namespace Database\Seeders;

use App\Models\Form;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubmissionSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('tr_TR');
        $statuses = ['new', 'reviewing', 'interview', 'offer', 'hired', 'rejected'];
        $investigations = ['pending', 'completed', 'none'];

        // Get actual form IDs from database
        $formIds = Form::pluck('id')->toArray();

        if (empty($formIds)) {
            $this->command->info('No forms found. Please run form seeders first.');

            return;
        }

        $submissions = [];
        $now = now();

        for ($i = 1; $i <= 20; $i++) {
            $createdAt = $faker->dateTimeBetween('-30 days', 'now');
            $submissions[] = [
                'form_id' => $faker->randomElement($formIds),
                'reference_no' => 'REF-2026-'.str_pad($i, 4, '0', STR_PAD_LEFT),
                'status' => $faker->randomElement($statuses),
                'investigation' => $faker->randomElement($investigations),
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ];
        }

        foreach ($submissions as $submission) {
            DB::table('submissions')->insert($submission);
        }
    }
}
