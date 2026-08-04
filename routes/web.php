<?php

declare(strict_types=1);

use App\Http\Controllers\AdjustmentController;
use App\Http\Controllers\AdvanceController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AttendanceReportController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\LeaveEntitlementController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\LeaveTypeController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\PayrollReportController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicFormController;
use App\Http\Controllers\SalaryComponentController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Public Form - show and submit (with rate limiting for submit)
Route::get('/forms/{slug}', [PublicFormController::class, 'show'])->name('public.forms.show');
Route::post('/forms/{slug}/submit', [PublicFormController::class, 'submit'])
    ->middleware('throttle:5,60') // Max 5 submissions per 60 minutes per IP
    ->name('public.forms.submit');

// Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard with cached stats (5 minutes TTL)
    Route::get('/dashboard', [DashboardController::class, '__invoke'])->name('dashboard');

    // Secure File Access (requires authentication)
    Route::prefix('files')->name('files.')->group(function () {
        Route::get('/show/{path}', [FileController::class, 'show'])->where('path', '.*')->name('show');
        Route::get('/download/{path}', [FileController::class, 'download'])->where('path', '.*')->name('download');
        Route::post('/signed-url/{path}', [FileController::class, 'generateSignedUrl'])->where('path', '.*')->name('signed-url');
    });

    // Test route - TEMPORARY for debugging
    Route::get('/test-files/{path}', function ($path) {
        $fullPath = storage_path('app/private/'.$path);

        return response()->json([
            'path' => $path,
            'fullPath' => $fullPath,
            'exists' => file_exists($fullPath),
            'realPath' => realpath($fullPath),
            'baseDir' => storage_path('app/private'),
        ]);
    })->where('path', '.*');

    // Admin - Departments
    Route::prefix('admin/departments')->name('admin.departments.')->group(function () {
        Route::get('/', [DepartmentController::class, 'index'])->name('index');
        Route::get('/create', [DepartmentController::class, 'create'])->name('create');
        Route::post('/', [DepartmentController::class, 'store'])->name('store');
        Route::get('/{department}/edit', [DepartmentController::class, 'edit'])->name('edit');
        Route::put('/{department}', [DepartmentController::class, 'update'])->name('update');
        Route::delete('/{department}', [DepartmentController::class, 'destroy'])->name('destroy');
    });

    // Admin - Forms
    Route::prefix('admin/forms')->name('admin.forms.')->group(function () {
        Route::get('/', [FormController::class, 'index'])->name('index');
        Route::get('/create', [FormController::class, 'create'])->name('create');
        Route::post('/', [FormController::class, 'store'])->name('store');
        Route::get('/{form}/edit', [FormController::class, 'edit'])->name('edit');
        Route::put('/{form}', [FormController::class, 'update'])->name('update');
        Route::delete('/{form}', [FormController::class, 'destroy'])->name('destroy');
    });

    // Admin - Submissions
    Route::prefix('admin/submissions')->name('admin.submissions.')->group(function () {
        Route::get('/', [SubmissionController::class, 'index'])->name('index');
        Route::get('/{submission}', [SubmissionController::class, 'show'])->name('show');
        Route::put('/{submission}/status', [SubmissionController::class, 'updateStatus'])->name('updateStatus');
        Route::put('/{submission}/investigation', [SubmissionController::class, 'updateInvestigation'])->name('updateInvestigation');
        Route::post('/{submission}/intelligence-reports', [SubmissionController::class, 'storeIntelligenceReport'])->name('storeIntelligenceReport');
        Route::delete('/{submission}/intelligence-reports/{report}', [SubmissionController::class, 'destroyIntelligenceReport'])->name('destroyIntelligenceReport');
        Route::post('/{submission}/comments', [SubmissionController::class, 'addComment'])->name('addComment');
        Route::delete('/{submission}', [SubmissionController::class, 'destroy'])->name('destroy');
    });

    // Admin - Users
    Route::prefix('admin/users')->name('admin.users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('/create', [UserController::class, 'create'])->name('create');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit');
        Route::put('/{user}', [UserController::class, 'update'])->name('update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
    });

    // Admin - Employees
    Route::prefix('admin/employees')->name('admin.employees.')->group(function () {
        Route::get('/', [EmployeeController::class, 'index'])->name('index');
        Route::get('/create', [EmployeeController::class, 'create'])->name('create');
        Route::post('/', [EmployeeController::class, 'store'])->name('store');
        Route::get('/{employee}', [EmployeeController::class, 'show'])->name('show');
        Route::get('/{employee}/edit', [EmployeeController::class, 'edit'])->name('edit');
        Route::put('/{employee}', [EmployeeController::class, 'update'])->name('update');
        Route::delete('/{employee}', [EmployeeController::class, 'destroy'])->name('destroy');

        // Doküman işlemleri
        Route::post('/{employee}/documents', [EmployeeController::class, 'uploadDocument'])->name('uploadDocument');
        Route::delete('/{employee}/documents/{documentId}', [EmployeeController::class, 'deleteDocument'])->name('deleteDocument');

        // Pozisyon geçmişi
        Route::post('/{employee}/positions', [EmployeeController::class, 'addPosition'])->name('addPosition');

        // İşten çıkarma
        Route::post('/{employee}/terminate', [EmployeeController::class, 'terminate'])->name('terminate');

        // Arama
        Route::get('/search', [EmployeeController::class, 'search'])->name('search');
    });

    // Admin - Salary Components
    Route::prefix('admin/salary-components')->name('admin.salary-components.')->group(function () {
        Route::get('/', [SalaryComponentController::class, 'index'])->name('index');
        Route::get('/create', [SalaryComponentController::class, 'create'])->name('create');
        Route::post('/', [SalaryComponentController::class, 'store'])->name('store');
        Route::get('/{salaryComponent}', [SalaryComponentController::class, 'show'])->name('show');
        Route::get('/{salaryComponent}/edit', [SalaryComponentController::class, 'edit'])->name('edit');
        Route::put('/{salaryComponent}', [SalaryComponentController::class, 'update'])->name('update');
        Route::delete('/{salaryComponent}', [SalaryComponentController::class, 'destroy'])->name('destroy');
    });

    // Admin - Payrolls
    Route::prefix('admin/payrolls')->name('admin.payrolls.')->group(function () {
        Route::get('/', [PayrollController::class, 'index'])->name('index');
        Route::get('/create', [PayrollController::class, 'create'])->name('create');
        Route::post('/', [PayrollController::class, 'store'])->name('store');
        Route::get('/{payroll}', [PayrollController::class, 'show'])->name('show');
        Route::get('/{payroll}/edit', [PayrollController::class, 'edit'])->name('edit');
        Route::put('/{payroll}', [PayrollController::class, 'update'])->name('update');
        Route::delete('/{payroll}', [PayrollController::class, 'destroy'])->name('destroy');

        // Bordro kalemleri oluştur
        Route::post('/{payroll}/generate-items', [PayrollController::class, 'generateItems'])->name('generateItems');

        // Bordro onay
        Route::post('/{payroll}/approve', [PayrollController::class, 'approve'])->name('approve');

        // Bordro yayınla
        Route::post('/{payroll}/publish', [PayrollController::class, 'publish'])->name('publish');
    });

    // Admin - Advances
    Route::prefix('admin/advances')->name('admin.advances.')->group(function () {
        Route::get('/', [AdvanceController::class, 'index'])->name('index');
        Route::get('/create', [AdvanceController::class, 'create'])->name('create');
        Route::post('/', [AdvanceController::class, 'store'])->name('store');
        Route::get('/get-salary-info', [AdvanceController::class, 'getSalaryInfo'])->name('getSalaryInfo');
        Route::get('/{advance}', [AdvanceController::class, 'show'])->name('show');
        Route::get('/{advance}/edit', [AdvanceController::class, 'edit'])->name('edit');
        Route::put('/{advance}', [AdvanceController::class, 'update'])->name('update');
        Route::delete('/{advance}', [AdvanceController::class, 'destroy'])->name('destroy');

        // Avans onay
        Route::post('/{advance}/approve', [AdvanceController::class, 'approve'])->name('approve');

        // Avans reddet
        Route::post('/{advance}/reject', [AdvanceController::class, 'reject'])->name('reject');

        // Avans ödenmiş olarak işaretle
        Route::post('/{advance}/mark-as-paid', [AdvanceController::class, 'markAsPaid'])->name('markAsPaid');

        // Avans iptal
        Route::post('/{advance}/cancel', [AdvanceController::class, 'cancel'])->name('cancel');
    });

    // Admin - Payroll Reports
    Route::prefix('admin/payroll-reports')->name('admin.payroll-reports.')->group(function () {
        Route::get('/', [PayrollReportController::class, 'index'])
            ->middleware([\App\Http\Middleware\CheckPayrollViewPermission::class])
            ->name('index');
        Route::get('/summary/{payroll}', [PayrollReportController::class, 'summary'])
            ->middleware([\App\Http\Middleware\CheckPayrollViewPermission::class])
            ->name('summary');
        Route::get('/tax-summary/{payroll}', [PayrollReportController::class, 'taxSummary'])
            ->middleware([\App\Http\Middleware\CheckPayrollViewPermission::class])
            ->name('taxSummary');
        Route::get('/department-summary/{payroll}', [PayrollReportController::class, 'departmentSummary'])
            ->middleware([\App\Http\Middleware\CheckPayrollViewPermission::class])
            ->name('departmentSummary');
        Route::get('/compare', [PayrollReportController::class, 'compare'])
            ->middleware([\App\Http\Middleware\CheckPayrollGeneratePermission::class])
            ->name('compare');
        Route::get('/annual', [PayrollReportController::class, 'annual'])
            ->middleware([\App\Http\Middleware\CheckPayrollGeneratePermission::class])
            ->name('annual');
    });

    // Admin - Leave Management
    Route::prefix('admin/leave')->name('admin.leave.')->group(function () {
        // Leave Types
        Route::prefix('types')->name('types.')->group(function () {
            Route::get('/', [LeaveTypeController::class, 'index'])->name('index');
            Route::get('/create', [LeaveTypeController::class, 'create'])->name('create');
            Route::post('/', [LeaveTypeController::class, 'store'])->name('store');
            Route::get('/{leaveType}', [LeaveTypeController::class, 'show'])->name('show');
            Route::get('/{leaveType}/edit', [LeaveTypeController::class, 'edit'])->name('edit');
            Route::put('/{leaveType}', [LeaveTypeController::class, 'update'])->name('update');
            Route::delete('/{leaveType}', [LeaveTypeController::class, 'destroy'])->name('destroy');
        });

        // Leave Entitlements
        Route::prefix('entitlements')->name('entitlements.')->group(function () {
            Route::get('/', [LeaveEntitlementController::class, 'index'])->name('index');
            Route::get('/create', [LeaveEntitlementController::class, 'create'])->name('create');
            Route::post('/', [LeaveEntitlementController::class, 'store'])->name('store');
            Route::get('/{leaveEntitlement}', [LeaveEntitlementController::class, 'show'])->name('show');
            Route::get('/{leaveEntitlement}/edit', [LeaveEntitlementController::class, 'edit'])->name('edit');
            Route::put('/{leaveEntitlement}', [LeaveEntitlementController::class, 'update'])->name('update');
            Route::delete('/{leaveEntitlement}', [LeaveEntitlementController::class, 'destroy'])->name('destroy');
        });

        // Leave Requests
        Route::prefix('requests')->name('requests.')->group(function () {
            Route::get('/', [LeaveRequestController::class, 'index'])->name('index');
            Route::post('/', [LeaveRequestController::class, 'store'])->name('store');
            Route::get('/{leaveRequest}', [LeaveRequestController::class, 'show'])->name('show');
            Route::put('/{leaveRequest}', [LeaveRequestController::class, 'update'])->name('update');
            Route::delete('/{leaveRequest}', [LeaveRequestController::class, 'destroy'])->name('destroy');
        });
    });

    // Admin - Attendance (PDKS)
    Route::prefix('admin/attendance')->name('admin.attendance.')->group(function () {
        Route::get('/', [AttendanceController::class, 'index'])->name('index');
        Route::get('/scan', [AttendanceController::class, 'scan'])->name('scan');
        Route::get('/{attendance}', [AttendanceController::class, 'show'])->name('show');
        Route::get('/{attendance}/edit', [AttendanceController::class, 'edit'])->name('edit');
        Route::post('/', [AttendanceController::class, 'store'])->name('store');
        Route::put('/{attendance}', [AttendanceController::class, 'update'])->name('update');
        Route::delete('/{attendance}', [AttendanceController::class, 'destroy'])->name('destroy');
        Route::post('/clock-in', [AttendanceController::class, 'clockIn'])
            ->name('clockIn');
        Route::post('/clock-out', [AttendanceController::class, 'clockOut'])
            ->name('clockOut');
        Route::post('/manual-clock', [AttendanceController::class, 'manualClock'])
            ->name('manual-clock');
        Route::get('/employee/{employeeId}', [AttendanceController::class, 'forEmployee'])->name('employee');
    });

    // Admin - Attendance Reports
    Route::prefix('admin/attendance-reports')->name('admin.attendance-reports.')->group(function () {
        Route::get('/', [AttendanceReportController::class, 'index'])->name('index');
        Route::get('/daily', [AttendanceReportController::class, 'daily'])->name('daily');
        Route::get('/monthly', [AttendanceReportController::class, 'monthly'])->name('monthly');
        Route::get('/overtime', [AttendanceReportController::class, 'overtime'])->name('overtime');
        Route::get('/export', [AttendanceReportController::class, 'export'])->name('export');
    });

    // Admin - Shifts
    Route::prefix('admin/shifts')->name('admin.shifts.')->group(function () {
        Route::get('/', [ShiftController::class, 'index'])->name('index');
        Route::get('/create', [ShiftController::class, 'create'])->name('create');
        Route::post('/', [ShiftController::class, 'store'])->name('store');
        Route::get('/schedules', [ShiftController::class, 'schedules'])->name('schedules');
        Route::get('/{shift}', [ShiftController::class, 'show'])->name('show');
        Route::get('/{shift}/edit', [ShiftController::class, 'edit'])->name('edit');
        Route::put('/{shift}', [ShiftController::class, 'update'])->name('update');
        Route::delete('/{shift}', [ShiftController::class, 'destroy'])->name('destroy');
        Route::post('/assign', [ShiftController::class, 'assignToEmployee'])
            ->middleware('throttle:shift_assignment')  // Rate limit individual shift assignments to prevent abuse
            ->name('assign');
        Route::post('/assign-bulk', [ShiftController::class, 'assignBulk'])
            ->middleware('throttle:shift_bulk_assignment')  // More restrictive for bulk operations
            ->name('assignBulk');
        Route::get('/schedule/{employeeId}', [ShiftController::class, 'getEmployeeSchedule'])->name('schedule');
    });

    // Admin - Work Calendars
    Route::prefix('admin/work-calendars')->name('admin.work-calendars.')->group(function () {
        Route::get('/', [CalendarController::class, 'index'])->name('index');
        Route::get('/create', [CalendarController::class, 'create'])->name('create');
        Route::post('/', [CalendarController::class, 'store'])->name('store');
        Route::get('/{calendar}', [CalendarController::class, 'show'])->name('show');
        Route::get('/{calendar}/edit', [CalendarController::class, 'edit'])->name('edit');
        Route::put('/{calendar}', [CalendarController::class, 'update'])->name('update');
        Route::delete('/{calendar}', [CalendarController::class, 'destroy'])->name('destroy');
        Route::post('/{calendarId}/toggle', [CalendarController::class, 'toggleStatus'])->name('toggle');
    });

    // Admin - Holidays
    Route::prefix('admin/holidays')->name('admin.holidays.')->group(function () {
        Route::get('/', [CalendarController::class, 'holidayIndex'])->name('index');
        Route::get('/create', [CalendarController::class, 'holidayCreate'])->name('create');
        Route::post('/', [CalendarController::class, 'holidayStore'])->name('store');
        Route::get('/{holiday}/edit', [CalendarController::class, 'holidayEdit'])->name('edit');
        Route::put('/{holiday}', [CalendarController::class, 'holidayUpdate'])->name('update');
        Route::delete('/{holiday}', [CalendarController::class, 'holidayDestroy'])->name('destroy');
        Route::post('/add-to-calendar', [CalendarController::class, 'addHoliday'])->name('addToCalendar');
    });

    // Admin - Attendance Adjustments
    Route::prefix('admin/adjustments')->name('admin.adjustments.')->group(function () {
        Route::get('/', [AdjustmentController::class, 'index'])->name('index');
        Route::get('/create', [AdjustmentController::class, 'create'])->name('create');
        Route::post('/', [AdjustmentController::class, 'store'])->name('store');
        Route::get('/{adjustment}', [AdjustmentController::class, 'show'])->name('show');
        Route::get('/{adjustment}/edit', [AdjustmentController::class, 'edit'])->name('edit');
        Route::put('/{adjustment}', [AdjustmentController::class, 'update'])->name('update');
        Route::put('/{adjustment}/update-status', [AdjustmentController::class, 'updateStatus'])->name('updateStatus');
        Route::delete('/{adjustment}', [AdjustmentController::class, 'destroy'])->name('destroy');
        Route::post('/{adjustment}/approve', [AdjustmentController::class, 'approve'])->name('approve');
        Route::post('/{adjustment}/reject', [AdjustmentController::class, 'reject'])->name('reject');
        Route::get('/my-requests', [AdjustmentController::class, 'myRequests'])->name('myRequests');
        Route::post('/request', [AdjustmentController::class, 'requestAdjustment'])->name('request');
    });

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
