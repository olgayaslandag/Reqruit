<?php

declare(strict_types=1);


use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Validation\ValidationException;
use Throwable;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\CheckUserStatus::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (Throwable $e) {
            // Don't expose raw error messages to end users in production
            if (app()->environment('production')) {
                // Log the actual exception for debugging
                \Log::error('Application Error', [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTraceAsString(),
                    'user' => auth()->check() ? auth()->user()->id : null,
                    'url' => request()->fullUrl(),
                    'method' => request()->method(),
                    'ip' => request()->ip(),
                ]);

                // Return generic error message
                if (request()->expectsJson()) {
                    return response()->json([
                        'message' => 'Something went wrong',
                    ], 500);
                }

                return response()->view('errors.500', [], 500);
            }

            // In development environments, show original errors
            return null;
        });

        // Custom rendering for validation errors (when needed to override)
        $exceptions->render(function (ValidationException $e) {
            if (request()->expectsJson()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $e->errors(),
                ], 422);
            }

            return null;
        });
    })->create();
