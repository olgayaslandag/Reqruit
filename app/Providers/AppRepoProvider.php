<?php

declare(strict_types=1);

namespace App\Providers;

use App\Interfaces\IAdvanceRepository;
use App\Interfaces\IAttendanceAdjustmentRepository;
use App\Interfaces\ICalendarRepository;
use App\Interfaces\IDepartmentRepository;
use App\Interfaces\IEmployeeRepository;
use App\Interfaces\IEmployeeSalaryRepository;
use App\Interfaces\IFormRepository;
use App\Interfaces\IHolidayRepository;
use App\Interfaces\ILeaveEntitlementRepository;
use App\Interfaces\ILeaveRequestRepository;
use App\Interfaces\ILeaveTypeRepository;
use App\Interfaces\IPayrollRepository;
use App\Interfaces\ISalaryComponentRepository;
use App\Interfaces\IShiftRepository;
use App\Interfaces\ISubmissionRepository;
use App\Interfaces\IUserRepository;
use App\Repositories\AdvanceRepository;
use App\Repositories\AttendanceAdjustmentRepository;
use App\Repositories\CalendarRepository;
use App\Repositories\DepartmentRepository;
use App\Repositories\EmployeeRepository as EmployeeRepositoryImpl;
use App\Repositories\EmployeeSalaryRepository;
use App\Repositories\FormRepository;
use App\Repositories\HolidayRepository;
use App\Repositories\LeaveEntitlementRepository;
use App\Repositories\LeaveRequestRepository;
use App\Repositories\LeaveTypeRepository;
use App\Repositories\PayrollRepository;
use App\Repositories\SalaryComponentRepository;
use App\Repositories\ShiftRepository;
use App\Repositories\SubmissionRepository;
use App\Repositories\UserRepository;
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
        $this->app->bind(IShiftRepository::class, ShiftRepository::class);
        $this->app->bind(ICalendarRepository::class, CalendarRepository::class);
        $this->app->bind(IHolidayRepository::class, HolidayRepository::class);
        $this->app->bind(IUserRepository::class, UserRepository::class);
        $this->app->bind(IAttendanceAdjustmentRepository::class, AttendanceAdjustmentRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
