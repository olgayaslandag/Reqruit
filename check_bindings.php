<?php

declare(strict_types=1);

// Service container binding kontrolü
require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\App;

echo "1. IPayrollRepository binding kontrolü:\n";
var_dump(App::bound(\App\Interfaces\IPayrollRepository::class));

echo "\n2. IPayrollRepository resolve kontrolü:\n";
try {
    $resolved = App::make(\App\Interfaces\IPayrollRepository::class);
    echo get_class($resolved)." resolved successfully\n";
} catch (\Exception $e) {
    echo 'Resolve failed: '.$e->getMessage()."\n";
}

echo "\n3. ISalaryComponentRepository binding kontrolü:\n";
var_dump(App::bound(\App\Interfaces\ISalaryComponentRepository::class));

echo "\n4. ISalaryComponentRepository resolve kontrolü:\n";
try {
    $resolved = App::make(\App\Interfaces\ISalaryComponentRepository::class);
    echo get_class($resolved)." resolved successfully\n";
} catch (\Exception $e) {
    echo 'Resolve failed: '.$e->getMessage()."\n";
}

echo "\n5. IAdvanceRepository binding kontrolü:\n";
var_dump(App::bound(\App\Interfaces\IAdvanceRepository::class));

echo "\n6. IAdvanceRepository resolve kontrolü:\n";
try {
    $resolved = App::make(\App\Interfaces\IAdvanceRepository::class);
    echo get_class($resolved)." resolved successfully\n";
} catch (\Exception $e) {
    echo 'Resolve failed: '.$e->getMessage()."\n";
}

echo "\n7. IEmployeeSalaryRepository binding kontrolü:\n";
var_dump(App::bound(\App\Interfaces\IEmployeeSalaryRepository::class));

echo "\n8. IEmployeeSalaryRepository resolve kontrolü:\n";
try {
    $resolved = App::make(\App\Interfaces\IEmployeeSalaryRepository::class);
    echo get_class($resolved)." resolved successfully\n";
} catch (\Exception $e) {
    echo 'Resolve failed: '.$e->getMessage()."\n";
}

echo "\n9. PayrollService dependency kontrolü:\n";
try {
    $resolved = App::make(\App\Services\PayrollService::class);
    echo get_class($resolved)." resolved successfully with dependencies\n";
} catch (\Exception $e) {
    echo 'Resolve failed: '.$e->getMessage()."\n";
}

echo "\n10. SalaryCalculationService dependency kontrolü:\n";
try {
    $resolved = App::make(\App\Services\SalaryCalculationService::class);
    echo get_class($resolved)." resolved successfully with dependencies\n";
} catch (\Exception $e) {
    echo 'Resolve failed: '.$e->getMessage()."\n";
}

echo "\n11. AdvanceService dependency kontrolü:\n";
try {
    $resolved = App::make(\App\Services\AdvanceService::class);
    echo get_class($resolved)." resolved successfully with dependencies\n";
} catch (\Exception $e) {
    echo 'Resolve failed: '.$e->getMessage()."\n";
}
