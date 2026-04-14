<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Bu alan zaten nullable yapılmış ve constraint ayarlanmış
        // Sadece mevcut doğruluk durumunu göstermek için bu işlemi ekliyoruz
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Bu alan zaten önceden nullable yapılmış, dolayısıyla geri sarma
        // işlemi için bir şey yapmaya gerek yok
    }
};
