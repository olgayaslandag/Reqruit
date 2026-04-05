<?php

declare(strict_types=1);

// 2025 yılı vergi ve sosyal güvenlik (SGK) parametreleri
return [
    // SGK ve işsizlik sigortası oranları
    'sgk' => [
        // SGK Genel Sağlık Sigortası oranı - işçi payı
        'employee_premium_rate' => env('SALARY_SGK_EMPLOYEE_PREMIUM_RATE', 0.14), // %14

        // İşsizlik sigortası oranı - işçi payı
        'unemployment_employee_rate' => env('SALARY_UNEMPLOYMENT_EMPLOYEE_RATE', 0.02), // %2

        // SGK oranı - işveren payı
        'employer_premium_rate' => env('SALARY_SGK_EMPLOYER_PREMIUM_RATE', 0.255), // %25.5

        // İşsizlik sigortası oranı - işveren payı
        'unemployment_employer_rate' => env('SALARY_UNEMPLOYMENT_EMPLOYER_RATE', 0.03), // %3
    ],

    // Damga vergisi oranı
    'stamp_tax_rate' => env('SALARY_STAMP_TAX_RATE', 0.00659), // %0.659

    // Gelir vergisi dilimleri (yıllık tutarlara göre)
    'income_tax_brackets' => [
        ['min' => 0, 'max' => 110000, 'rate' => 0.15],      // %15 - İlk dilim
        ['min' => 110000, 'max' => 230000, 'rate' => 0.20], // %20 - İkinci dilim
        ['min' => 230000, 'max' => 580000, 'rate' => 0.27], // %27 - Üçüncü dilim
        ['min' => 580000, 'max' => 3000000, 'rate' => 0.35], // %35 - Dördüncü dilim
        ['min' => 3000000, 'max' => PHP_INT_MAX, 'rate' => 0.40], // %40 - Beşinci dilim
    ],

    // Asgari ücret (aylık - 2025)
    'minimum_wage_monthly' => env('SALARY_MINIMUM_WAGE_MONTHLY', 22650.00),

    // SGK tavan ve taban ücretler (2025)
    'sgk_limits' => [
        'min_monthly' => env('SALARY_SGK_MIN_MONTHLY', 22650.00),
        'max_monthly' => env('SALARY_SGK_MAX_MONTHLY', 170130.00),
    ],
];
