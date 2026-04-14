<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\AdvanceRequest;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AdvanceRequestFactory extends Factory
{
    protected $model = AdvanceRequest::class;

    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'amount' => fake()->randomFloat(2, 1000, 20000),
            'reason' => fake()->randomElement([
                'Acil nakit ihtiyacı',
                'Ev masrafları',
                'Eğitim ücreti',
                'Sağlık giderleri',
                'Taşınma masrafları',
                'Düğün/hıdırellez masrafları',
            ]),
            'requested_date' => fake()->date('Y-m-d', '+30 days'),
            'status' => 'pending',
            'approver_id' => null,
            'rejection_reason' => null,
            'payment_date' => null,
            'notes' => fake()->optional()->sentence(),
        ];
    }

    public function forEmployee(Employee $employee): static
    {
        return $this->state(fn (array $attributes) => [
            'employee_id' => $employee->id,
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'approver_id' => null,
            'rejection_reason' => null,
            'payment_date' => null,
        ]);
    }

    public function approved(?User $approver = null): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'approver_id' => $approver?->id ?? User::factory(),
            'rejection_reason' => null,
        ]);
    }

    public function rejected(?User $approver = null): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'approver_id' => $approver?->id ?? User::factory(),
            'rejection_reason' => fake()->randomElement([
                'Bütçe yetersizliği',
                'Şirket politikasına uygun değil',
                'Daha önce avans almış',
                'Gerekli belgeler eksik',
            ]),
        ]);
    }

    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paid',
            'approver_id' => User::factory(),
            'payment_date' => fake()->date('Y-m-d', 'now'),
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }

    public function customAmount(float $amount): static
    {
        return $this->state(fn (array $attributes) => [
            'amount' => $amount,
        ]);
    }

    public function withNotes(string $notes): static
    {
        return $this->state(fn (array $attributes) => [
            'notes' => $notes,
        ]);
    }
}
