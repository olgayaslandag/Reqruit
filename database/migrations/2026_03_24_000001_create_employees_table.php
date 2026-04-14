<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('identity_no', 11)->unique(); // TC Kimlik No
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->date('birth_date');
            $table->enum('gender', ['male', 'female', 'not_specified']);
            $table->string('phone', 20)->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();

            // Acil durum bilgileri
            $table->string('emergency_contact_name', 200)->nullable();
            $table->string('emergency_contact_phone', 20)->nullable();
            $table->string('emergency_contact_relation', 50)->nullable();

            // Kişisel bilgiler
            $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed'])->nullable();
            $table->unsignedTinyInteger('children_count')->default(0);

            // İş bilgileri
            $table->date('hire_date');
            $table->string('position_title', 200);
            $table->foreignId('department_id')->constrained('departments')->onDelete('restrict');
            $table->enum('employment_type', ['full_time', 'part_time', 'remote', 'hybrid']);
            $table->enum('contract_type', ['permanent', 'fixed_term', 'internship', 'probation']);
            $table->foreignId('manager_id')->nullable()->constrained('employees')->onDelete('set null');

            // İşten ayrılma bilgileri
            $table->date('termination_date')->nullable();
            $table->text('termination_reason')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
