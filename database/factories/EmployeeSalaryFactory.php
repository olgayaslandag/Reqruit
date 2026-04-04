<?php

declare(strict_types=1);


namespace Database\Factories;

use App\Models\Employee;
use App\Models\EmployeeSalary;
use App\Models\SalaryComponent;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeSalaryFactory extends Factory
{
    protected $model = EmployeeSalary::class;

    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'salary_component_id' => SalaryComponent::factory(),
            'amount' => fake()->randomFloat(2, 5000, 50000),
            'start_date' => fake()->date('Y-m-d', 'now'),
            'end_date' => null,
            'payment_frequency' => fake()->randomElement(['monthly', 'biweekly', 'weekly']),
            'notes' => fake()->optional()->sentence(),
        ];
    }

    public function forEmployee(Employee $employee): static
    {
        return $this->state(fn (array $attributes) => [
            'employee_id' => $employee->id,
        ]);
    }

    public function withComponent(SalaryComponent $component): static
    {
        return $this->state(fn (array $attributes) => [
            'salary_component_id' => $component->id,
        ]);
    }

    public function monthly(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_frequency' => 'monthly',
        ]);
    }

    public function biweekly(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_frequency' => 'biweekly',
        ]);
    }

    public function weekly(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_frequency' => 'weekly',
        ]);
    }

    public function ended(?string $endDate = '2024-12-31'): static
    {
        return $this->state(fn (array $attributes) => [
            'end_date' => $endDate,
        ]);
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'end_date' => null,
        ]);
    }
}
