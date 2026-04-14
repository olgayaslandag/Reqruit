<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\ContractTypeEnum;
use App\Enums\EmploymentTypeEnum;
use App\Enums\GenderEnum;
use App\Models\Department;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    public function definition(): array
    {
        return [
            'identity_no' => fake()->unique()->numerify('###########'), // 11 haneli TC Kimlik
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'birth_date' => fake()->date('Y-m-d', '-18 years'),
            'gender' => GenderEnum::MALE->value,
            'phone' => '5'.fake()->numerify('### ### ## ##'), // 5321234567 formatı
            'email' => fake()->unique()->safeEmail(),
            'address' => fake()->address(),
            'emergency_contact_name' => fake()->name(),
            'emergency_contact_phone' => '5'.fake()->numerify('### ### ## ##'),
            'emergency_contact_relation' => 'Eş',
            'marital_status' => 'single',
            'children_count' => 0,
            'hire_date' => fake()->date('Y-m-d', 'now'),
            'position_title' => fake()->jobTitle(),
            'department_id' => Department::factory(),
            'employment_type' => EmploymentTypeEnum::FULL_TIME->value,
            'contract_type' => ContractTypeEnum::PERMANENT->value,
            'manager_id' => null,
            'termination_date' => null,
            'termination_reason' => null,
        ];
    }

    public function withManager(Employee $manager): static
    {
        return $this->state(fn (array $attributes) => [
            'manager_id' => $manager->id,
        ]);
    }

    public function terminated(string $terminationDate = '2024-12-31', string $reason = 'İstifa'): static
    {
        return $this->state(fn (array $attributes) => [
            'termination_date' => $terminationDate,
            'termination_reason' => $reason,
        ]);
    }

    public function partTime(): static
    {
        return $this->state(fn (array $attributes) => [
            'employment_type' => EmploymentTypeEnum::PART_TIME->value,
        ]);
    }

    public function remote(): static
    {
        return $this->state(fn (array $attributes) => [
            'employment_type' => EmploymentTypeEnum::REMOTE->value,
        ]);
    }
}
