<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Gate;

class TestPermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:permissions {email?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test payroll report permissions for a user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email') ?: 'olgayaslandag@gmail.com';

        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("User not found: $email");

            return 1;
        }

        $this->info("Testing permissions for user: $email");
        $this->info('User role: '.$user->rank_id->value.' ('.$user->rank_id->label().')');

        // Test direct gate access
        $viewResult = Gate::forUser($user)->check('view-any-payroll-report');
        $genResult = Gate::forUser($user)->check('generate-payroll-report');

        $this->info('view-any-payroll-report: '.($viewResult ? 'ALLOWED' : 'DENIED'));
        $this->info('generate-payroll-report: '.($genResult ? 'ALLOWED' : 'DENIED'));

        // List user roles if any
        $spatieRoles = $user->roles->pluck('name')->toArray();
        $this->info('Spatie Roles: '.implode(', ', $spatieRoles));

        return 0;
    }
}
