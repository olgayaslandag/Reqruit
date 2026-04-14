<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\UserRoleEnum;
use App\Enums\UserStatusEnum;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'rank_id' => UserRoleEnum::RECRUITER->value,
            'status_id' => UserStatusEnum::ACTIVE->value,
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function admin(): static
    {
        return $this->afterCreating(function ($user) {
            $user->assignRole('admin');
        })->state(fn (array $attributes) => [
            'rank_id' => UserRoleEnum::ADMIN->value,
        ]);
    }

    public function hr(): static
    {
        return $this->afterCreating(function ($user) {
            $user->assignRole('hr');
        })->state(fn (array $attributes) => [
            'rank_id' => UserRoleEnum::IK_MANAGER->value,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status_id' => UserStatusEnum::INACTIVE->value,
        ]);
    }
}
