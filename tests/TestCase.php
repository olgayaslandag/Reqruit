<?php

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Only create roles/permissions if the tables exist
        if ($this->app->make('db')->getSchemaBuilder()->hasTable('permissions')) {
            $this->createRolesAndPermissions();
        }
    }

    protected function createRolesAndPermissions(): void
    {
        // Create permissions
        $permissions = [
            'view-applications', 'create-applications', 'update-applications', 'delete-applications',
            'review-applications', 'export-applications',
            'view-forms', 'create-forms', 'update-forms', 'delete-forms',
            'view-departments', 'create-departments', 'update-departments', 'delete-departments',
            'view-users', 'create-users', 'update-users', 'delete-users',
            'add-comments', 'view-private-comments',
            'manage-settings',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create super_admin role with all permissions
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        $superAdmin->syncPermissions($permissions);

        // Create other roles
        Role::firstOrCreate(['name' => 'ik_manager', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'recruiter', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'department_head', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'observer', 'guard_name' => 'web']);
    }
}
