<?php

declare(strict_types=1);

use App\Http\Controllers\Api\WidgetController;
use App\Http\Controllers\Api\WidgetFormController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/widget/test', function () {
        return response()->json(['message' => 'Widget API is working!']);
    });

    Route::prefix('widget')->name('api.widget.')->group(function () {
        Route::get('/departments', [WidgetController::class, 'departments'])->name('departments');
        Route::get('/departments/{id}', [WidgetController::class, 'department'])->name('department');
        Route::get('/departments/slug/{slug}', [WidgetController::class, 'departmentSlug'])->name('department.slug');

        Route::get('/forms/{slug}', [WidgetFormController::class, 'show'])->name('forms.show');
        Route::post('/forms/{slug}/submit', [WidgetFormController::class, 'submit'])
            ->middleware('throttle:5,60')
            ->name('forms.submit');
    });
});
