<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\PayrollPeriod;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PayrollPeriodFactory extends Factory
{
    protected $model = PayrollPeriod::class;

    public function definition(): array
    {
        $year = fake()->numberBetween(2024, 2026);
        $month = fake()->numberBetween(1, 12);

        return [
            'name' => sprintf('%02d/%d Dönemi', $month, $year),
            'start_date' => sprintf('%d-%02d-01', $year, $month),
            'end_date' => sprintf('%d-%02d-%d', $year, $month, cal_days_in_month(CAL_GREGORIAN, $month, $year)),
            'payment_frequency' => 'monthly',
            'payment_date' => sprintf('%d-%02d-15', $year, $month + 1),
            'status' => 'draft',
            'notes' => fake()->optional()->sentence(),
            'created_by' => User::factory(),
        ];
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

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
        ]);
    }

    public function managerApproved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'manager_approved',
        ]);
    }

    public function hrApproved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'hr_approved',
        ]);
    }

    public function accountingApproved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'accounting_approved',
        ]);
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
        ]);
    }

    public function forCreator(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'created_by' => $user->id,
        ]);
    }
}
