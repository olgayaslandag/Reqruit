<?php

declare(strict_types=1);


namespace Database\Factories;

use App\Models\Employee;
use App\Models\PayrollPeriod;
use App\Models\SalaryAdjustment;
use App\Models\SalaryComponent;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SalaryAdjustmentFactory extends Factory
{
    protected $model = SalaryAdjustment::class;

    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'payroll_period_id' => PayrollPeriod::factory(),
            'salary_component_id' => SalaryComponent::factory(),
            'old_amount' => fake()->randomFloat(2, 1000, 10000),
            'new_amount' => fake()->randomFloat(2, 1200, 12000),
            'reason' => fake()->sentence,
            'adjusted_by' => User::factory(),
        ];
    }
}
