<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submission_ai_evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('submissions')->onDelete('cascade');
            $table->tinyInteger('rating')->unsigned()->nullable();
            $table->text('review')->nullable();
            $table->string('provider')->default('openai');
            $table->string('model')->nullable();
            $table->enum('status', ['completed', 'failed'])->default('completed');
            $table->text('error')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->index('submission_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submission_ai_evaluations');
    }
};