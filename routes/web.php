<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicFormController;
use App\Http\Controllers\SubmissionController;
use Illuminate\Foundation\Application;
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

// Public Form - show and submit
Route::get('/forms/{slug}', [PublicFormController::class, 'show'])->name('public.forms.show');
Route::post('/forms/{slug}/submit', [PublicFormController::class, 'submit'])->name('public.forms.submit');

// Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', function () {
        $stats = [
            'totalSubmissions' => DB::table('submissions')->count(),
            'pendingSubmissions' => DB::table('submissions')->where('status', 'new')->count(),
            'activeForms' => DB::table('forms')->count(),
            'departments' => DB::table('departments')->count(),
        ];

        $weeklySubmissions = DB::table('submissions')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

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

    // Admin - Departments
    Route::prefix('admin/departments')->name('admin.departments.')->group(function () {
        Route::get('/', [DepartmentController::class, 'index'])->name('index');
        Route::post('/', [DepartmentController::class, 'store'])->name('store');
        Route::put('/{id}', [DepartmentController::class, 'update'])->name('update');
        Route::delete('/{id}', [DepartmentController::class, 'destroy'])->name('destroy');
    });

    // Admin - Forms
    Route::prefix('admin/forms')->name('admin.forms.')->group(function () {
        Route::get('/', [FormController::class, 'index'])->name('index');
        Route::get('/create', [FormController::class, 'create'])->name('create');
        Route::post('/', [FormController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [FormController::class, 'edit'])->name('edit');
        Route::put('/{id}', [FormController::class, 'update'])->name('update');
        Route::delete('/{id}', [FormController::class, 'destroy'])->name('destroy');
    });

    // Admin - Submissions
    Route::prefix('admin/submissions')->name('admin.submissions.')->group(function () {
        Route::get('/', [SubmissionController::class, 'index'])->name('index');
        Route::get('/{id}', [SubmissionController::class, 'show'])->name('show');
        Route::put('/{id}/status', [SubmissionController::class, 'updateStatus'])->name('updateStatus');
        Route::put('/{id}/investigation', [SubmissionController::class, 'updateInvestigation'])->name('updateInvestigation');
        Route::post('/{id}/comments', [SubmissionController::class, 'addComment'])->name('addComment');
        Route::delete('/{id}', [SubmissionController::class, 'destroy'])->name('destroy');
    });

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
