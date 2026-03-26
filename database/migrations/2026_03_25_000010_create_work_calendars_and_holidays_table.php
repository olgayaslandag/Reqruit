<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_calendars', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('total_days')->default(365);
            $table->integer('working_days')->default(252);
            $table->integer('holiday_days')->default(113);
            $table->timestamps();
        });

        Schema::create('holidays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_calendar_id')->constrained('work_calendars');
            $table->string('name');
            $table->date('date');
            $table->enum('type', ['official', 'company']);
            $table->text('description')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->timestamps();

            $table->index(['work_calendar_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('holidays');
        Schema::dropIfExists('work_calendars');
    }
};
