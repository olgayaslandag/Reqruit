<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->enum('document_type', ['contract', 'diploma', 'certificate', 'id_copy', 'other']);
            $table->string('file_path', 500);
            $table->string('file_name', 255);
            $table->unsignedInteger('file_size'); // bytes
            $table->string('mime_type', 100);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_documents');
    }
};
