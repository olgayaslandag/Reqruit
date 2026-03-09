<?php

namespace Database\Seeders;

use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubmissionCommentSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('tr_TR');

        $submissionIds = DB::table('submissions')->pluck('id');
        $userId = DB::table('users')->first()->id ?? 1;

        $comments = [];

        foreach ($submissionIds as $submissionId) {
            $commentCount = $faker->numberBetween(0, 3);

            for ($i = 0; $i < $commentCount; $i++) {
                $comments[] = [
                    'submission_id' => $submissionId,
                    'user_id' => $userId,
                    'comment' => $faker->paragraph(),
                    'rating' => $faker->optional(70)->numberBetween(1, 5),
                    'is_private' => $faker->boolean(30),
                    'created_at' => $faker->dateTimeBetween('-10 days', 'now'),
                    'updated_at' => now(),
                ];
            }
        }

        if (! empty($comments)) {
            foreach (array_chunk($comments, 10) as $chunk) {
                DB::table('submission_comments')->insert($chunk);
            }
        }
    }
}
