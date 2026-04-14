<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\AdvanceDeduction;
use App\Models\AdvanceRequest;
use App\Models\PayrollPeriod;
use Illuminate\Database\Eloquent\Factories\Factory;

class AdvanceDeductionFactory extends Factory
{
    protected $model = AdvanceDeduction::class;

    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-2 months', '-1 month')->format('Y-m-d');
        $endDate = fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d');

        return [
            'advance_request_id' => AdvanceRequest::factory(),
            'payroll_period_id' => PayrollPeriod::factory(),
            'deduction_amount' => fake()->randomFloat(2, 500, 5000),
            'remaining_amount' => fake()->randomFloat(2, 0, 2000),
            'status' => fake()->randomElement(['pending', 'deducted', 'completed', 'cancelled']),
            'deduction_date' => fake()->optional()->dateTimeBetween($startDate, $endDate)->format('Y-m-d'),
        ];
    }
}
