<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicFormController;
use App\Http\Controllers\SubmissionController;
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

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
