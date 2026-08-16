@php
    $isLightPage = request()->routeIs('login', 'register', 'password.*', 'public.forms.*', 'verification.*');
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Reqruit - İK Yönetim Platformu">
<meta name="keywords" content="ik yazılımı, insan kaynakları, hrms, personel devam kontrolü, bordro, izin yönetimi, maaş">
<meta name="author" content="Reqruit">
<link rel="icon" href="/assets/images/reqruit-icon.png" type="image/png">
<link rel="shortcut icon" href="/assets/images/reqruit-icon.png" type="image/png">
<title inertia>{{ config('app.name', 'Reqruit') }}</title>

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap" id="main-font-link">
<link rel="stylesheet" href="/assets/css/plugins/bootstrap.min.css">
@if (!$isLightPage)
<link rel="stylesheet" href="/assets/fonts/tabler-icons.min.css">
<link rel="stylesheet" href="/assets/fonts/feather.css">
<link rel="stylesheet" href="/assets/fonts/fontawesome.css">
<link rel="stylesheet" href="/assets/fonts/material.css">
<link rel="stylesheet" href="/assets/css/style.css" id="main-style-link">
<link rel="stylesheet" href="/assets/css/style-preset.css">
@endif
@routes
@viteReactRefresh
@vite(['resources/js/app.jsx', 'resources/css/app.css'])
@inertiaHead
</head>
<body data-pc-preset="preset-1" data-pc-direction="ltr" data-pc-theme="light">
    @if (!$isLightPage)
    <div class="loader-bg">
        <div class="loader-track">
            <div class="loader-fill"></div>
        </div>
    </div>
    @endif
@inertia

<!-- Scripts needed for admin template (jQuery may still be used by some plugins) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" defer crossorigin="anonymous"></script>
@if (!$isLightPage)
<script src="https://code.jquery.com/jquery-3.7.1.min.js" defer crossorigin="anonymous"></script>
<script src="/assets/js/plugins/popper.min.js" defer></script>
<script src="/assets/js/plugins/simplebar.min.js" defer></script>
<script src="/assets/js/fonts/custom-font.js" defer></script>
<script src="/assets/js/fonts/custom-ant-icon.js" defer></script>
<script src="/assets/js/pcoded.js" defer></script>
<script src="/assets/js/plugins/feather.min.js" defer></script>
@endif
</body>
</html>
