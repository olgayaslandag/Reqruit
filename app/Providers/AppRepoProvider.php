<?php

namespace App\Providers;

use App\Interfaces\DepartmentInterface;
use App\Interfaces\FormInterface;
use App\Interfaces\SubmissionInterface;
use App\Repositories\DepartmentRepository;
use App\Repositories\FormRepository;
use App\Repositories\SubmissionRepository;
use Illuminate\Support\ServiceProvider;

class AppRepoProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(DepartmentInterface::class, DepartmentRepository::class);
        $this->app->bind(FormInterface::class, FormRepository::class);
        $this->app->bind(SubmissionInterface::class, SubmissionRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
