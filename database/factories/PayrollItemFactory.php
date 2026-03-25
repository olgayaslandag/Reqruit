<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\PayrollItem;
use App\Models\PayrollPeriod;
use App\Models\SalaryComponent;
use Illuminate\Database\Eloquent\Factories\Factory;

class PayrollItemFactory extends Factory
{
    protected $model = PayrollItem::class;

    public function definition(): array
    {
        return [
            'payroll_period_id' => PayrollPeriod::factory(),
            'employee_id' => Employee::factory(),
            'salary_component_id' => SalaryComponent::factory(),
            'amount' => fake()->randomFloat(2, 1000, 50000),
            'calculated_amount' => fake()->randomFloat(2, 800, 45000),
            'quantity' => fake()->numberBetween(1, 10),
            'unit_price' => fake()->randomFloat(2, 100, 500),
            'description' => fake()->optional()->sentence(),
        ];
    }

    public function forPeriod(PayrollPeriod $period): static
    {
        return $this->state(fn (array $attributes) => [
            'payroll_period_id' => $period->id,
        ]);
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

    public function earning(): static
    {
        return $this->state(fn (array $attributes) => [
            'salary_component_id' => SalaryComponent::factory()->earning(),
        ]);
    }

    public function deduction(): static
    {
        return $this->state(fn (array $attributes) => [
            'salary_component_id' => SalaryComponent::factory()->deduction(),
        ]);
    }

    public function noQuantity(): static
    {
        return $this->state(fn (array $attributes) => [
            'quantity' => 1,
            'unit_price' => null,
        ]);
    }

    public function customAmount(float $amount): static
    {
        return $this->state(fn (array $attributes) => [
            'amount' => $amount,
            'calculated_amount' => $amount,
        ]);
    }
}
