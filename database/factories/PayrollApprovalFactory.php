<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\PayrollApproval;
use App\Models\PayrollPeriod;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PayrollApprovalFactory extends Factory
{
    protected $model = PayrollApproval::class;

    public function definition(): array
    {
        return [
            'payroll_period_id' => PayrollPeriod::factory(),
            'approver_id' => User::factory(),
            'role' => fake()->randomElement(['manager', 'hr', 'accounting']),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected']),
            'comment' => fake()->optional()->sentence,
            'approved_at' => fake()->optional()->dateTimeBetween('-1 week', 'now'),
        ];
    }
}
