<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_interactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->nullable()->constrained('candidates')->onDelete('cascade');
            $table->foreignId('submission_id')->nullable()->constrained('submissions')->onDelete('cascade');
            $table->enum('interaction_type', ['meeting', 'phone', 'email', 'offer', 'negotiation', 'other'])->default('meeting');
            $table->date('interaction_date');
            $table->text('description')->nullable();
            $table->text('response')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->index('candidate_id');
            $table->index('submission_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_interactions');
    }
};