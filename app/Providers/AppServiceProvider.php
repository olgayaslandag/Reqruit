<?php

namespace App\Providers;

use App\Models\AdvanceRequest;
use App\Models\PayrollPeriod;
use App\Policies\AdvancePolicy;
use App\Policies\PayrollPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Interfaces\IPayrollRepository::class,
            \App\Repositories\PayrollRepository::class
        );

        $this->app->bind(
            \App\Interfaces\ISalaryComponentRepository::class,
            \App\Repositories\SalaryComponentRepository::class
        );

        $this->app->bind(
            \App\Interfaces\IAdvanceRepository::class,
            \App\Repositories\AdvanceRepository::class
        );

        $this->app->bind(
            \App\Interfaces\IEmployeeSalaryRepository::class,
            \App\Repositories\EmployeeSalaryRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // PayrollPeriod modeli için policy mapping
        Gate::policy(PayrollPeriod::class, PayrollPolicy::class);

        // AdvanceRequest modeli için policy mapping
        Gate::policy(AdvanceRequest::class, AdvancePolicy::class);

        // Payroll report için özel yetki tanımlaması
        Gate::define('view-any-payroll-report', function ($user) {
            // enum rolü veya spatie rolü check et
            $userEnumValue = $user->rank_id->value ?? $user->rank_id ?? 0;

            // Map enum values to role names
            $enumToRole = [
                \App\Enums\UserRoleEnum::ADMIN->value => 'admin',
                \App\Enums\UserRoleEnum::IK_MANAGER->value => 'hr',
            ];

            $userRoleName = $enumToRole[$userEnumValue] ?? null;

            if ($userRoleName && in_array($userRoleName, ['admin', 'hr', 'accounting', 'manager'])) {
                return true;
            }

            // Also check for Spatie roles
            foreach (['admin', 'hr', 'accounting', 'manager'] as $role) {
                if ($user->hasRole($role)) {
                    return true;
                }
            }

            return false;
        });

        Gate::define('generate-payroll-report', function ($user) {
            // enum rolü veya spatie rolü check et
            $userEnumValue = $user->rank_id->value ?? $user->rank_id ?? 0;

            // Map enum values to role names
            $enumToRole = [
                \App\Enums\UserRoleEnum::ADMIN->value => 'admin',
                \App\Enums\UserRoleEnum::IK_MANAGER->value => 'hr',
            ];

            $userRoleName = $enumToRole[$userEnumValue] ?? null;

            if ($userRoleName && in_array($userRoleName, ['admin', 'hr', 'accounting'])) {
                return true;
            }

            // Also check for Spatie roles
            foreach (['admin', 'hr', 'accounting'] as $role) {
                if ($user->hasRole($role)) {
                    return true;
                }
            }

            return false;
        });
    }
}
