<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

class DepartmentFactory extends Factory
{
    protected $model = Department::class;

    public function definition(): array
    {
        return [
            'title' => fake()->company(),
            'slug' => fake()->unique()->slug(),
            'emails' => [fake()->email()],
            'parent_id' => null,
        ];
    }

    public function withParent(): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => Department::factory(),
        ]);
    }
}
