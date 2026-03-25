<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('salary_components', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200); // Maaş kalemi adı
            $table->string('code', 50)->unique(); // Benzersiz kod (örn: BASIC_SALARY, OVERTIME, MEAL_DEDUCTION)
            $table->enum('type', ['earning', 'deduction']); // Kazanç veya Kesinti
            $table->enum('category', ['fixed', 'variable']); // Sabit veya Değişken
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_taxable')->default(true); // Vergiye tabi mi
            $table->boolean('is_sgk_applicable')->default(true); // SGK uygulanır mı
            $table->decimal('default_amount', 15, 2)->nullable(); // Varsayılan tutar
            $table->integer('sort_order')->default(0); // Sıralama
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salary_components');
    }
};
