<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class CheckPayrollGeneratePermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Kullanıcının giriş yapmış olması gerekiyor
        if (! Auth::check()) {
            abort(401, 'Oturum açık değil. Lütfen giriş yapın.');
        }

        $user = Auth::user();

        // Yetki kontrolü
        $allowed = Gate::forUser($user)->check('generate-payroll-report');

        if (! $allowed) {
            abort(403, 'Bu eylemi gerçekleştirme yetkiniz yok: generate-payroll-report. Kullanıcı: '.$user->email.', Rol: '.($user->rank_id?->value ?? 'N/A').' - '.($user->rank_id?->label() ?? 'N/A'));
        }

        return $next($request);
    }
}
