<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            if (! $this->hasIndex('employees', 'employees_department_employment_type_index')) {
                $table->index(['department_id', 'employment_type'], 'employees_department_employment_type_index');
            }
            if (! $this->hasIndex('employees', 'employees_termination_hire_index')) {
                $table->index(['termination_date', 'hire_date'], 'employees_termination_hire_index');
            }
        });

        Schema::table('employee_salaries', function (Blueprint $table) {
            if (! $this->hasIndex('employee_salaries', 'employee_salaries_employee_end_index')) {
                $table->index(['employee_id', 'end_date'], 'employee_salaries_employee_end_index');
            }
        });

        Schema::table('payroll_periods', function (Blueprint $table) {
            if (! $this->hasIndex('payroll_periods', 'payroll_periods_status_index')) {
                $table->index('status', 'payroll_periods_status_index');
            }
        });

        Schema::table('advance_requests', function (Blueprint $table) {
            if (! $this->hasIndex('advance_requests', 'advance_requests_employee_status_index')) {
                $table->index(['employee_id', 'status'], 'advance_requests_employee_status_index');
            }
        });

        Schema::table('advance_deductions', function (Blueprint $table) {
            if (! $this->hasIndex('advance_deductions', 'advance_deductions_request_status_index')) {
                $table->index(['advance_request_id', 'status'], 'advance_deductions_request_status_index');
            }
        });

        Schema::table('bonus_payments', function (Blueprint $table) {
            if (! $this->hasIndex('bonus_payments', 'bonus_payments_employee_date_index')) {
                $table->index(['employee_id', 'payment_date'], 'bonus_payments_employee_date_index');
            }
        });
    }

    private function hasIndex(string $table, string $index): bool
    {
        $connection = Schema::getConnection();
        $schema = $connection->getSchemaBuilder();

        $indexes = $schema->getIndexes($table);
        foreach ($indexes as $indexName => $indexInfo) {
            if ($indexName === $index) {
                return true;
            }
        }

        return false;
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropIndex('employees_department_employment_type_index');
            $table->dropIndex('employees_termination_hire_index');
        });

        Schema::table('employee_salaries', function (Blueprint $table) {
            $table->dropIndex('employee_salaries_employee_end_index');
        });

        Schema::table('payroll_periods', function (Blueprint $table) {
            $table->dropIndex('payroll_periods_status_index');
        });

        Schema::table('advance_requests', function (Blueprint $table) {
            $table->dropIndex('advance_requests_employee_status_index');
        });

        Schema::table('advance_deductions', function (Blueprint $table) {
            $table->dropIndex('advance_deductions_request_status_index');
        });

        Schema::table('bonus_payments', function (Blueprint $table) {
            $table->dropIndex('bonus_payments_employee_date_index');
        });
    }
};
