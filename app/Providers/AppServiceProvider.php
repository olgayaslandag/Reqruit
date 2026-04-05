<?php

declare(strict_types=1);

namespace App\Providers;

use App\Interfaces\ILeaveEntitlementRepository;
use App\Interfaces\ILeaveRequestRepository;
use App\Interfaces\ILeaveTypeRepository;
use App\Interfaces\IShiftRepository;
use App\Interfaces\IUserRepository;
use App\Models\AdvanceRequest;
use App\Models\LeaveEntitlement;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\PayrollPeriod;
use App\Models\User;
use App\Policies\AdvancePolicy;
use App\Policies\LeaveEntitlementPolicy;
use App\Policies\LeaveRequestPolicy;
use App\Policies\LeaveTypePolicy;
use App\Policies\PayrollPolicy;
use App\Repositories\LeaveEntitlementRepository;
use App\Repositories\LeaveRequestRepository;
use App\Repositories\LeaveTypeRepository;
use App\Repositories\ShiftRepository;
use App\Repositories\UserRepository;
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

        // Leave Module Bindings
        $this->app->bind(
            ILeaveTypeRepository::class,
            LeaveTypeRepository::class
        );

        $this->app->bind(
            ILeaveEntitlementRepository::class,
            LeaveEntitlementRepository::class
        );

        $this->app->bind(
            ILeaveRequestRepository::class,
            LeaveRequestRepository::class
        );

        $this->app->bind(
            IUserRepository::class,
            UserRepository::class
        );

        $this->app->bind(
            IShiftRepository::class,
            ShiftRepository::class
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

        // Leave models for policy mapping
        Gate::policy(LeaveType::class, LeaveTypePolicy::class);
        Gate::policy(LeaveEntitlement::class, LeaveEntitlementPolicy::class);
        Gate::policy(LeaveRequest::class, LeaveRequestPolicy::class);

        // User modeli için policy mapping
        Gate::policy(User::class, UserPolicy::class);

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
