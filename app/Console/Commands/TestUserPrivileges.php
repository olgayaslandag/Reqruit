<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Gate;

class TestUserPrivileges extends Command
{
    protected $signature = 'test:userprivileges {email?}';

    protected $description = 'Test user privileges for all systems';

    public function handle()
    {
        $email = $this->argument('email') ?: 'olgayaslandag@gmail.com';

        $user = User::where('email', $email)->first();
        if (! $user) {
            $this->error("User not found: $email");

            return 1;
        }

        $this->info("Testing user: $user->email (Role: ".($user->rank_id->value ?? '?').'-'.($user->rank_id->label() ?? 'N/A').')');

        // Test various permissions
        $tests = [
            ['gate' => 'viewAny', 'model' => \App\Models\PayrollPeriod::class, 'name' => 'Payrolls'],
            ['gate' => 'viewAny', 'model' => \App\Models\SalaryComponent::class, 'name' => 'SalaryComponents'],
            ['gate' => 'viewAny', 'model' => \App\Models\AdvanceRequest::class, 'name' => 'Advances'],
            ['gate' => 'view-any-payroll-report', 'model' => null, 'name' => 'PayrollReports'],
        ];

        foreach ($tests as $test) {
            $allowed = false;
            if ($test['model']) {
                $tempModel = new $test['model'];
                $allowed = Gate::forUser($user)->check($test['gate'], $tempModel);
            } else {
                $allowed = Gate::forUser($user)->check($test['gate']);
            }

            $result = $allowed ? '<fg=green>ALLOWED</>' : '<fg=red>DENIED</>';
            $this->line("{$test['name']}: $result");
        }

        return 0;
    }
}
