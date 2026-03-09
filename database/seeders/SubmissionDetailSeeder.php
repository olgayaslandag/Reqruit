<?php

namespace Database\Seeders;

use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubmissionDetailSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('tr_TR');

        $submissions = DB::table('submissions')->pluck('form_id', 'id');
        $formFields = DB::table('form_fields')->get()->groupBy('form_id');

        $details = [];

        foreach ($submissions as $submissionId => $formId) {
            $fields = $formFields->get($formId, collect());

            foreach ($fields as $field) {
                $value = $this->generateFieldValue($faker, $field);

                $details[] = [
                    'submission_id' => $submissionId,
                    'field_name' => $field->name,
                    'field_label' => $field->label,
                    'field_value' => $value,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        foreach (array_chunk($details, 10) as $chunk) {
            DB::table('submission_details')->insert($chunk);
        }
    }

    private function generateFieldValue($faker, $field)
    {
        $options = $field->options ? json_decode($field->options) : null;

        if ($field->type === 'file') {
            $ext = $options && is_array($options) ? $faker->randomElement($options) : 'pdf';

            return "https://example.com/uploads/sample.{$ext}";
        }

        if ($options && is_array($options) && count($options) > 0) {
            return $faker->randomElement($options);
        }

        return match ($field->name) {
            'name' => $faker->name,
            'email' => $faker->unique()->safeEmail,
            'telefon' => $faker->phoneNumber,
            default => match ($field->type) {
                'email' => $faker->email,
                'tel' => $faker->phoneNumber,
                'number' => $faker->numberBetween(100, 100000),
                'date' => $faker->date('Y-m-d'),
                'textarea' => $faker->sentence(10),
                default => $faker->word,
            },
        };
    }
}
