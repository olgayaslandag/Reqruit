<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendance_records', function (Blueprint $table) {
            $table->dropForeign(['employee_id']); // mevcut constrainti sil
        });

        Schema::table('attendance_records', function (Blueprint $table) {
            $table->foreign('employee_id')
                ->references('id')
                ->on('employees')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('attendance_records', function (Blueprint $table) {
            $table->dropForeign(['employee_id']);
        });

        Schema::table('attendance_records', function (Blueprint $table) {
            $table->foreign('employee_id')
                ->references('id')
                ->on('employees');
        });
    }
};
