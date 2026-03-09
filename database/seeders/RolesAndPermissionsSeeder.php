<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permissions
        $permissions = [
            // Application permissions
            'view-applications',
            'create-applications',
            'update-applications',
            'delete-applications',
            'review-applications',
            'export-applications',

            // Form permissions
            'view-forms',
            'create-forms',
            'update-forms',
            'delete-forms',

            // Department permissions
            'view-departments',
            'create-departments',
            'update-departments',
            'delete-departments',

            // User management permissions
            'view-users',
            'create-users',
            'update-users',
            'delete-users',

            // Comment permissions
            'add-comments',
            'view-private-comments',

            // Settings
            'manage-settings',
        ];

        // Create permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Define roles with their permissions
        $roles = [
            'super_admin' => [
                'view-applications', 'create-applications', 'update-applications', 'delete-applications',
                'review-applications', 'export-applications',
                'view-forms', 'create-forms', 'update-forms', 'delete-forms',
                'view-departments', 'create-departments', 'update-departments', 'delete-departments',
                'view-users', 'create-users', 'update-users', 'delete-users',
                'add-comments', 'view-private-comments',
                'manage-settings',
            ],
            'ik_manager' => [
                'view-applications', 'create-applications', 'update-applications', 'delete-applications',
                'review-applications', 'export-applications',
                'view-forms', 'create-forms', 'update-forms', 'delete-forms',
                'view-departments', 'create-departments', 'update-departments',
                'view-users',
                'add-comments', 'view-private-comments',
            ],
            'recruiter' => [
                'view-applications', 'create-applications', 'update-applications',
                'review-applications',
                'view-forms', 'create-forms', 'update-forms',
                'view-departments',
                'add-comments',
            ],
            'department_head' => [
                'view-applications', 'update-applications',
                'review-applications',
                'view-forms',
                'view-departments',
                'add-comments',
            ],
            'observer' => [
                'view-applications',
                'view-forms',
                'view-departments',
            ],
        ];

        // Create roles and assign permissions
        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->syncPermissions($rolePermissions);
        }

        $this->command->info('Roles and permissions seeded successfully.');
    }
}
