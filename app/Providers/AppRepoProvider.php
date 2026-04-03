<?php

namespace App\Providers;

use App\Interfaces\IAdvanceRepository;
use App\Interfaces\IDepartmentRepository;
use App\Interfaces\IEmployeeRepository;
use App\Interfaces\IEmployeeSalaryRepository;
use App\Interfaces\IFormRepository;
use App\Interfaces\ILeaveEntitlementRepository;
use App\Interfaces\ILeaveRequestRepository;
use App\Interfaces\ILeaveTypeRepository;
use App\Interfaces\IPayrollRepository;
use App\Interfaces\ISalaryComponentRepository;
use App\Interfaces\ISubmissionRepository;
use App\Repositories\AdvanceRepository;
use App\Repositories\DepartmentRepository;
use App\Repositories\EmployeeRepository as EmployeeRepositoryImpl;
use App\Repositories\EmployeeSalaryRepository;
use App\Repositories\FormRepository;
use App\Repositories\LeaveEntitlementRepository;
use App\Repositories\LeaveRequestRepository;
use App\Repositories\LeaveTypeRepository;
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
        $this->app->bind(IEmployeeRepository::class, EmployeeRepositoryImpl::class);
        $this->app->bind(IPayrollRepository::class, PayrollRepository::class);
        $this->app->bind(ISalaryComponentRepository::class, SalaryComponentRepository::class);
        $this->app->bind(IAdvanceRepository::class, AdvanceRepository::class);
        $this->app->bind(IEmployeeSalaryRepository::class, EmployeeSalaryRepository::class);
        $this->app->bind(IDepartmentRepository::class, DepartmentRepository::class);
        $this->app->bind(IFormRepository::class, FormRepository::class);
        $this->app->bind(ISubmissionRepository::class, SubmissionRepository::class);

        $this->app->bind(ILeaveRequestRepository::class, LeaveRequestRepository::class);
        $this->app->bind(ILeaveEntitlementRepository::class, LeaveEntitlementRepository::class);
        $this->app->bind(ILeaveTypeRepository::class, LeaveTypeRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
