<?php

namespace App\Console\Commands;

use App\Models\AdvanceRequest;
use App\Models\User;
use App\Policies\AdvancePolicy;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Gate;

class DebugAdvancePolicy extends Command
{
    protected $signature = 'debug:advance-policy {email?}';

    protected $description = 'Debug advance policy for specific user';

    public function handle()
    {
        $email = $this->argument('email') ?? 'olgayaslandag@gmail.com';

        $user = User::where('email', $email)->first();
        if (! $user) {
            $this->error("User not found: $email");

            return 1;
        }

        $this->info('Debugging advance policy for user: '.$user->email);
        $this->info('Role enum: '.$user->rank_id->value.' - '.$user->rank_id->label());
        $this->info('Spatie roles count: '.$user->roles->count());

        foreach ($user->roles as $role) {
            $this->info('Spatie role: '.$role->name);
        }

        // Try with advance policy directly
        $policy = new AdvancePolicy;
        $advanceMock = new AdvanceRequest;

        $this->info("\nTesting viewAny directly:");
        $result1 = $policy->viewAny($user);
        $this->info('Result: '.($result1 ? 'ALLOWED' : 'DENIED'));

        $this->info("\nTesting Gate::check:");
        try {
            $result2 = Gate::forUser($user)->check('viewAny', $advanceMock);
            $this->info('Gate result: '.($result2 ? 'ALLOWED' : 'DENIED'));
        } catch (\Exception $e) {
            $this->warn('Gate exception: '.$e->getMessage());
        }

        $this->info("\nAdvances Count: ".AdvanceRequest::count());

        return 0;
    }
}
