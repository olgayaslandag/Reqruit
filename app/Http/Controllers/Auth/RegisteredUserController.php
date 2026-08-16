<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Enums\UserRoleEnum;
use App\Enums\UserStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function __construct(private UserService $userService) {}

    /**
     * Display the registration view.
     */
    public function create(): Response|RedirectResponse
    {
        if (! config('auth.allow_registration', false)) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        if (! config('auth.allow_registration', false)) {
            return redirect()->route('login');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = $this->userService->create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'rank_id' => UserRoleEnum::RECRUITER->value,
            'status_id' => UserStatusEnum::PENDING->value, // Yeni kayıtlar beklemede
        ]);

        event(new Registered($user));

        return redirect()->route('login')->with('status', 'Kaydınız alındı. Hesabınız onaylandıktan sonra giriş yapabilirsiniz.');
    }
}
