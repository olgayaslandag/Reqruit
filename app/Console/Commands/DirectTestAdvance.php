<?php

declare(strict_types=1);
namespace App\Console\Commands;

use App\Models\AdvanceRequest;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Gate;

class DirectTestAdvance extends Command
{
    protected $signature = 'test:directadvance';

    protected $description = 'Direct test for advance policy';

    public function handle()
    {
        $user = User::whereEmail('olgayaslandag@gmail.com')->first();
        $advance = new AdvanceRequest;

        $this->info('Testing advance policy directly');
        $this->info('User: '.$user->email.', Role: '.$user->rank_id->value.' ('.$user->rank_id->label().')');

        // Test with Gate directly
        $result = Gate::forUser($user)->check('viewAny', $advance);
        $this->info('Direct gate check result: '.($result ? 'ALLOWED' : 'DENIED'));

        // Test with manual call to policy
        $policy = new \App\Policies\AdvancePolicy;
        $result2 = $policy->viewAny($user);
        $this->info('Manual policy call result: '.($result2 ? 'ALLOWED' : 'DENIED'));

        // Try to get why it's denied
        $this->info('Valid roles for viewAny: admin, hr, accounting, manager');
        $this->info('User role enum value: '.$user->rank_id->value);
        $this->info('User role enum label: '.$user->rank_id->label());

        return 0;
    }
}
