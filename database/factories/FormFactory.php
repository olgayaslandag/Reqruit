<?php

declare(strict_types=1);


namespace Database\Factories;

use App\Models\Department;
use App\Models\Form;
use Illuminate\Database\Eloquent\Factories\Factory;

class FormFactory extends Factory
{
    protected $model = Form::class;

    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true).' Form',
            'slug' => fake()->unique()->slug(),
            'description' => fake()->sentence(),
            'department_id' => Department::factory(),
        ];
    }
}
