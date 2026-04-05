<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class GetUserRoleCheck extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'getuserrolecheck';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command to check user roles and permissions';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $user = User::whereEmail('olgayaslandag@gmail.com')->first();

        if (! $user) {
            $this->error('User not found');

            return 1;
        }

        $this->info("User ID: {$user->id}");
        $this->info("User Email: {$user->email}");
        $this->info('User Rank Value: '.$user->rank_id?->value);

        $roles = $user->roles;
        if ($roles->count() > 0) {
            $this->info('User Roles:');
            foreach ($roles as $role) {
                $this->line("- {$role->name} ({$role->display_name})");
            }
        } else {
            $this->info('User has no roles');

            // Directly check by rank_id
            $this->info('Rank/Role mapping by rank_id: '.$user->rank_id?->value);
        }

        $permissions = $user->permissions;
        if ($permissions->count() > 0) {
            $this->info('User Permissions:');
            foreach ($permissions as $permission) {
                $this->line("- {$permission->name} ({$permission->display_name})");
            }
        } else {
            $this->info('User has no direct permissions');
        }

        // Check specific admin role
        $this->info('Has admin role via role list: '.($user->hasRole('admin') ? 'Yes' : 'No'));
        $this->info('Has admin role via rank_id: '.($user->rank_id?->value == 1 ? 'Yes' : 'No'));

        return 0;
    }
}
