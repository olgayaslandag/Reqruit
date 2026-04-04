<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Reqruit - Modern Admin Dashboard">
<meta name="keywords" content="admin dashboard, laravel, react, inertia">
<meta name="author" content="Reqruit">
<link rel="icon" href="/favicon.ico" type="image/x-icon">
<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
<title inertia>{{ config('app.name', 'Reqruit') }}</title>

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap" id="main-font-link">
<link rel="stylesheet" href="/assets/fonts/tabler-icons.min.css">
<link rel="stylesheet" href="/assets/fonts/feather.css">
<link rel="stylesheet" href="/assets/fonts/fontawesome.css">
<link rel="stylesheet" href="/assets/fonts/material.css">
<link rel="stylesheet" href="/assets/css/style.css" id="main-style-link">
<link rel="stylesheet" href="/assets/css/style-preset.css">
@routes
@viteReactRefresh
@vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
@inertiaHead
@vite('resources/css/app.css')
</head>
<body data-pc-preset="preset-1" data-pc-direction="ltr" data-pc-theme="light">
    <div class="loader-bg">
        <div class="loader-track">
            <div class="loader-fill"></div>
        </div>
  </div>
@inertia

<!-- Scripts needed for admin template (jQuery may still be used by some plugins) -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="/assets/js/plugins/popper.min.js"></script>
<script src="/assets/js/plugins/simplebar.min.js"></script>
<script src="/assets/js/fonts/custom-font.js"></script>
<script src="/assets/js/fonts/custom-ant-icon.js"></script>
<script src="/assets/js/pcoded.js"></script>
<script src="/assets/js/plugins/feather.min.js"></script>
</body>
</html>
