<?php

use App\Http\Controllers\AdvanceController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\PayrollReportController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicFormController;
use App\Http\Controllers\SalaryComponentController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
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
    Route::get('/dashboard', function () {
        $stats = Cache::remember('dashboard.stats', 300, function () {
            return [
                'totalSubmissions' => DB::table('submissions')->count(),
                'pendingSubmissions' => DB::table('submissions')->where('status', 'new')->count(),
                'activeForms' => DB::table('forms')->count(),
                'departments' => DB::table('departments')->count(),
            ];
        });

        $weeklySubmissions = Cache::remember('dashboard.weekly_submissions', 300, function () {
            return DB::table('submissions')
                ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
                ->where('created_at', '>=', now()->subDays(7))
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        });

        $days = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dayName = now()->subDays($i)->locale('tr')->dayName;
            $count = $weeklySubmissions->firstWhere('date', $date)?->count ?? 0;
            $days[] = [
                'date' => $date,
                'day' => $dayName,
                'count' => $count,
            ];
        }

        return Inertia::render('Dashboard', ['stats' => $stats, 'weeklySubmissions' => $days]);
    })->name('dashboard');

    // Secure File Access (requires authentication)
    Route::prefix('files')->name('files.')->group(function () {
        Route::get('/show/{path}', [FileController::class, 'show'])->where('path', '.*')->name('show');
        Route::get('/download/{path}', [FileController::class, 'download'])->where('path', '.*')->name('download');
        Route::post('/signed-url/{path}', [FileController::class, 'generateSignedUrl'])->where('path', '.*')->name('signed-url');
    });

    // Admin - Departments
    Route::prefix('admin/departments')->name('admin.departments.')->group(function () {
        Route::get('/', [DepartmentController::class, 'index'])->name('index');
        Route::post('/', [DepartmentController::class, 'store'])->name('store');
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

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
