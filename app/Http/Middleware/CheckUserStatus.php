<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Enums\UserStatusEnum;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserStatus
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            if ($user->status_id instanceof UserStatusEnum) {
                $status = $user->status_id;
            } elseif (is_int($user->status_id)) {
                $status = UserStatusEnum::tryFrom($user->status_id);
            } else {
                $status = UserStatusEnum::ACTIVE; // default
            }

            // Aktif olmayan kullanıcıları engelle
            if ($status !== UserStatusEnum::ACTIVE) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect()->route('login')
                    ->with('error', 'Hesabınız aktif değil. Lütfen yönetici ile iletişime geçin.');
            }
        }

        return $next($request);
    }
}
