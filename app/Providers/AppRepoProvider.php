<?php

namespace App\Providers;

use App\Interfaces\IAdvanceRepository;
use App\Interfaces\IDepartmentRepository;
use App\Interfaces\IEmployeeRepository;
use App\Interfaces\IEmployeeSalaryRepository;
use App\Interfaces\IFormRepository;
use App\Interfaces\IPayrollRepository;
use App\Interfaces\ISalaryComponentRepository;
use App\Interfaces\ISubmissionRepository;
use App\Repositories\AdvanceRepository;
use App\Repositories\DepartmentRepository;
use App\Repositories\EmployeeRepository as EmployeeRepositoryImpl;
use App\Repositories\EmployeeSalaryRepository;
use App\Repositories\FormRepository;
use App\Repositories\PayrollRepository;
use App\Repositories\SalaryComponentRepository;
use App\Repositories\SubmissionRepository;
use Illuminate\Support\ServiceProvider;

class AppRepoProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Employee
        $this->app->bind(IEmployeeRepository::class, EmployeeRepositoryImpl::class);

        // Payroll
        $this->app->bind(IPayrollRepository::class, PayrollRepository::class);

        // Salary Component
        $this->app->bind(ISalaryComponentRepository::class, SalaryComponentRepository::class);

        // Advance
        $this->app->bind(IAdvanceRepository::class, AdvanceRepository::class);

        // Employee Salary
        $this->app->bind(IEmployeeSalaryRepository::class, EmployeeSalaryRepository::class);

        // Existing bindings
        $this->app->bind(IDepartmentRepository::class, DepartmentRepository::class);
        $this->app->bind(IFormRepository::class, FormRepository::class);
        $this->app->bind(ISubmissionRepository::class, SubmissionRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
