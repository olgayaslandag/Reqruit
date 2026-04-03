<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $roles = [
            'super_admin' => 'Tüm sisteme erişim',
            'admin' => 'Yönetici',
            'hr' => 'İK Yöneticisi',
            'ik_manager' => 'İK Yöneticisi',
            'recruiter' => 'İşe Alım Uzmanı',
            'department_head' => 'Departman Müdürü',
            'observer' => 'Gözlemci',
        ];

        foreach ($roles as $name => $description) {
            Role::updateOrCreate(
                ['name' => $name, 'guard_name' => 'web'],
                ['name' => $name, 'guard_name' => 'web']
            );
        }

        $permissions = [
            'employee.view',
            'employee.create',
            'employee.update',
            'employee.delete',
            'payroll.view',
            'payroll.create',
            'payroll.approve',
            'payroll.report',
            'advance.view',
            'advance.approve',
            'advance.reject',
            'attendance.view',
            'attendance.manage',
            'leave.view',
            'leave.approve',
            'department.view',
            'department.create',
            'form.view',
            'form.create',
            'submission.view',
            'submission.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['name' => $permission, 'guard_name' => 'web'],
                ['name' => $permission, 'guard_name' => 'web']
            );
        }

        $this->command->info('Roles and permissions seeded successfully');
    }
}
