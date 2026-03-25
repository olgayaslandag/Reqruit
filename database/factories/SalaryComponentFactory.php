<?php

namespace Database\Factories;

use App\Models\SalaryComponent;
use Illuminate\Database\Eloquent\Factories\Factory;

class SalaryComponentFactory extends Factory
{
    protected $model = SalaryComponent::class;

    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([
                'Temel Maaş',
                'Fazla Mesai',
                'Yemek Ücreti',
                'Ulaşım Ücreti',
                'Prim',
                'İkramiye',
                'AGİ',
                'Gelir Vergisi',
                'SGK İşçi Payı',
                'İşsizlik Sigortası',
                'Sendika Kesintisi',
                'İcra Kesintisi',
                'Avans Kesintisi',
            ]),
            'code' => fake()->unique()->randomElement([
                'BASIC_SALARY',
                'OVERTIME',
                'MEAL_ALLOWANCE',
                'TRANSPORT_ALLOWANCE',
                'PERFORMANCE_BONUS',
                'ANNUAL_BONUS',
                'AGI',
                'INCOME_TAX',
                'SGK_EMPLOYEE',
                'UNEMPLOYMENT_INSURANCE',
                'UNION_DEDUCTION',
                'GARNISHMENT',
                'ADVANCE_DEDUCTION',
            ]),
            'type' => fake()->randomElement(['earning', 'deduction']),
            'category' => fake()->randomElement(['fixed', 'variable']),
            'description' => fake()->sentence(),
            'is_active' => true,
            'is_taxable' => true,
            'is_sgk_applicable' => true,
            'default_amount' => fake()->randomFloat(2, 0, 50000),
            'sort_order' => fake()->numberBetween(1, 100),
        ];
    }

    public function earning(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'earning',
        ]);
    }

    public function deduction(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'deduction',
        ]);
    }

    public function fixed(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'fixed',
        ]);
    }

    public function variable(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'variable',
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    public function nonTaxable(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_taxable' => false,
        ]);
    }

    public function sgkExempt(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_sgk_applicable' => false,
        ]);
    }
}
