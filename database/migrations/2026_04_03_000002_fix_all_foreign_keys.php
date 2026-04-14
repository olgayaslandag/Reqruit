<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // attendance_adjustments tablosu için constraint'leri ekle
        Schema::table('attendance_adjustments', function (Blueprint $table) {
            $table->dropForeign(['attendance_record_id']);
            $table->dropForeign(['requested_by']);
            $table->dropForeign(['approved_by']);

            $table->foreign('attendance_record_id')
                ->references('id')
                ->on('attendance_records')
                ->onDelete('set null')
                ->onUpdate('cascade');

            $table->foreign('requested_by')
                ->references('id')
                ->on('users')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('approved_by')
                ->references('id')
                ->on('users')
                ->onDelete('set null')
                ->onUpdate('cascade');
        });

        // attendance_summaries tablosu için constraint'leri ekle
        Schema::table('attendance_summaries', function (Blueprint $table) {
            $table->dropForeign(['employee_id']);

            $table->foreign('employee_id')
                ->references('id')
                ->on('employees')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });

        // holidays tablosu için constraint'leri ekle
        Schema::table('holidays', function (Blueprint $table) {
            $table->dropForeign(['work_calendar_id']);

            $table->foreign('work_calendar_id')
                ->references('id')
                ->on('work_calendars')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });

        // shift_templates tablosu için constraint'leri ekle
        Schema::table('shift_templates', function (Blueprint $table) {
            $table->dropForeign(['shift_id']);
            $table->dropForeign(['work_calendar_id']);

            $table->foreign('shift_id')
                ->references('id')
                ->on('shifts')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('work_calendar_id')
                ->references('id')
                ->on('work_calendars')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });

        // shift_schedules tablosu için constraint'leri ekle
        Schema::table('shift_schedules', function (Blueprint $table) {
            $table->dropForeign(['shift_id']);
            $table->dropForeign(['work_calendar_id']);
            $table->dropForeign(['employee_id']);
            $table->dropForeign(['assigned_by']);

            $table->foreign('shift_id')
                ->references('id')
                ->on('shifts')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('work_calendar_id')
                ->references('id')
                ->on('work_calendars')
                ->onDelete('set null')
                ->onUpdate('cascade');

            $table->foreign('employee_id')
                ->references('id')
                ->on('employees')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('assigned_by')
                ->references('id')
                ->on('users')
                ->onDelete('set null')
                ->onUpdate('cascade');
        });

        // advance_requests tablosu için constraint'leri ekle
        Schema::table('advance_requests', function (Blueprint $table) {
            $table->dropForeign(['employee_id']);

            $table->foreign('employee_id')
                ->references('id')
                ->on('employees')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });

        // payroll_approvals tablosu için constraint'i暂时yeni migrate'de yapacağız
        // aşağıda özel bir nullable migration oluşturuldu dolayısıyla bu burada tekrar düzenlenmeyecek
        // Bu sebeple bu işlemi burada pas geçiyoruz
    }

    public function down(): void
    {
        // attendance_adjustments tablosu için constraint'leri sil
        Schema::table('attendance_adjustments', function (Blueprint $table) {
            $table->dropForeign(['attendance_record_id']);
            $table->dropForeign(['requested_by']);
            $table->dropForeign(['approved_by']);

            // Orjinal haline döndür (yalnızca foreign key'leri kaldır)
            $table->foreignId('attendance_record_id')->nullable()->change();
            $table->foreignId('requested_by')->change();
            $table->foreignId('approved_by')->nullable()->change();
        });

        // attendance_summaries tablosu için constraint'leri sil
        Schema::table('attendance_summaries', function (Blueprint $table) {
            $table->dropForeign(['employee_id']);
            $table->foreignId('employee_id')->change();
        });

        // holidays tablosu için constraint'leri sil
        Schema::table('holidays', function (Blueprint $table) {
            $table->dropForeign(['work_calendar_id']);
            $table->foreignId('work_calendar_id')->change();
        });

        // shift_templates tablosu için constraint'leri sil
        Schema::table('shift_templates', function (Blueprint $table) {
            $table->dropForeign(['shift_id']);
            $table->dropForeign(['work_calendar_id']);
            $table->foreignId('shift_id')->change();
            $table->foreignId('work_calendar_id')->change();
        });

        // shift_schedules tablosu için constraint'leri sil
        Schema::table('shift_schedules', function (Blueprint $table) {
            $table->dropForeign(['shift_id']);
            $table->dropForeign(['work_calendar_id']);
            $table->dropForeign(['employee_id']);
            $table->dropForeign(['assigned_by']);
            $table->foreignId('shift_id')->change();
            $table->foreignId('work_calendar_id')->nullable()->change();
            $table->foreignId('employee_id')->change();
            $table->foreignId('assigned_by')->nullable()->change();
        });

        // advance_requests tablosu için constraint'leri sil
        Schema::table('advance_requests', function (Blueprint $table) {
            $table->dropForeign(['employee_id']);
            $table->foreignId('employee_id')->change();
        });

        // payroll_approvals tablosu için constraint'leri sil (ama biz özel olarak yönetiyoruz bu alanı)
        // approver_id özel işlemleri için ayrı bir migration yapıyoruz
    }
};
