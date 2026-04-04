<?php

declare(strict_types=1);


namespace Database\Factories;

use App\Models\Form;
use App\Models\Submission;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubmissionFactory extends Factory
{
    protected $model = Submission::class;

    public function definition(): array
    {
        return [
            'form_id' => Form::factory(),
            'reference_no' => 'APP-'.strtoupper(fake()->bothify('????####')),
            'status' => fake()->randomElement(['new', 'reviewing', 'interview', 'offer', 'hired', 'rejected']),
            'investigation' => fake()->randomElement(['pending', 'completed', 'none']),
        ];
    }

    public function asNew(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'new',
        ]);
    }

    public function asReviewing(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'reviewing',
        ]);
    }

    public function asHired(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'hired',
        ]);
    }
}
