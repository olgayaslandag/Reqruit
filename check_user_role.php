<?php

require_once 'vendor/autoload.php';

// Laravel'in .env dosyasını yükle
$app = new Illuminate\Foundation\Application(
    $_ENV['APP_BASE_PATH'] ?? dirname(__DIR__)
);

$app->useEnvironmentPath($_ENV['APP_BASE_PATH'] ?? dirname(dirname(__DIR__)));
$app->loadEnvironmentFrom('.env');
$app->configure('app');

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Kullanıcıyı bul ve rolllerini görüntüle
$db = $app->make('db');
$user = $db->selectOne('SELECT id, email, rank_id FROM users WHERE email = ?', ['olgayaslandag@gmail.com']);

echo "User ID: {$user->id}\n";
echo "User Email: {$user->email}\n";
echo "User Rank ID: {$user->rank_id}\n";

// Kullanıcı rolllerini kontrol et
$roles = $db->select('
    SELECT r.id, r.name, r.display_name 
    FROM roles r 
    JOIN model_has_roles mhr ON r.id = mhr.role_id 
    JOIN users u ON mhr.model_id = u.id 
    WHERE u.email = ?', ['olgayaslandag@gmail.com']);

if ($roles) {
    echo "User Roles:\n";
    foreach ($roles as $role) {
        echo "- {$role->name} ({$role->display_name})\n";
    }
} else {
    echo "User has no roles\n";
    // Bu kullanıcının herhangi bir perm var mı kontrol et
    $permissions = $db->select('
        SELECT p.name, p.display_name
        FROM permissions p
        JOIN model_has_permissions mhp ON p.id = mhp.permission_id
        JOIN users u ON mhp.model_id = u.id
        WHERE u.email = ?', ['olgayaslandag@gmail.com']);

    if ($permissions) {
        echo "User Permissions:\n";
        foreach ($permissions as $perm) {
            echo "- {$perm->name} ({$perm->display_name})\n";
        }
    } else {
        echo "User has no permissions either\n";
    }
}
