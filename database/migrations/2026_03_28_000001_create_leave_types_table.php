<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leave_types', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // İzin türü adı (Yıllık, Hastalık, vs.)
            $table->boolean('is_paid')->default(true); // Ücretli mi?
            $table->boolean('requires_document')->default(false); // Belge zorunluluğu
            $table->unsignedSmallInteger('max_duration_days')->nullable(); // Maksimum süre (gün)
            $table->string('code')->unique(); // Kısa kod (YILLIK, HASTALIK, vs.)
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_types');
    }
};
