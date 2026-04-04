<?php

declare(strict_types=1);


namespace Database\Factories;

use App\Models\BonusPayment;
use App\Models\Employee;
use App\Models\PayrollPeriod;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BonusPaymentFactory extends Factory
{
    protected $model = BonusPayment::class;

    public function definition(): array
    {
        $amount = fake()->randomFloat(2, 1000, 50000);
        $taxRate = 0.15; // Standart gelir vergisi oranı
        $taxAmount = $amount * $taxRate;

        return [
            'employee_id' => Employee::factory(),
            'payroll_period_id' => PayrollPeriod::factory(),
            'bonus_type' => fake()->randomElement([
                'performance',
                'annual',
                'signing',
                'holiday',
                'project',
                'referral',
            ]),
            'amount' => $amount,
            'tax_amount' => $taxAmount,
            'net_amount' => $amount - $taxAmount,
            'payment_date' => fake()->date('Y-m-d', 'now'),
            'description' => fake()->optional()->sentence(),
            'approved_by' => User::factory(),
        ];
    }

    public function forEmployee(Employee $employee): static
    {
        return $this->state(fn (array $attributes) => [
            'employee_id' => $employee->id,
        ]);
    }

    public function forPeriod(PayrollPeriod $period): static
    {
        return $this->state(fn (array $attributes) => [
            'payroll_period_id' => $period->id,
        ]);
    }

    public function performance(): static
    {
        return $this->state(fn (array $attributes) => [
            'bonus_type' => 'performance',
        ]);
    }

    public function annual(): static
    {
        return $this->state(fn (array $attributes) => [
            'bonus_type' => 'annual',
        ]);
    }

    public function signing(): static
    {
        return $this->state(fn (array $attributes) => [
            'bonus_type' => 'signing',
        ]);
    }

    public function holiday(): static
    {
        return $this->state(fn (array $attributes) => [
            'bonus_type' => 'holiday',
        ]);
    }

    public function project(): static
    {
        return $this->state(fn (array $attributes) => [
            'bonus_type' => 'project',
        ]);
    }

    public function customAmount(float $amount, float $taxRate = 0.15): static
    {
        return $this->state(fn (array $attributes) => [
            'amount' => $amount,
            'tax_amount' => $amount * $taxRate,
            'net_amount' => $amount - ($amount * $taxRate),
        ]);
    }

    public function withoutPeriod(): static
    {
        return $this->state(fn (array $attributes) => [
            'payroll_period_id' => null,
        ]);
    }

    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_date' => fake()->date('Y-m-d', 'now'),
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_date' => null,
        ]);
    }
}
