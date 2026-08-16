<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    protected \App\Services\UserService $userService;

    public function __construct(\App\Services\UserService $userService)
    {
        $this->userService = $userService;
        $this->authorizeResource(User::class, 'user');
    }

    public function index(Request $request)
    {
        // Simple authorization check using rank_id enum
        $user = auth()->user();
        if (! in_array($user?->rank_id?->value, [1, 2])) {
            abort(403, 'Unauthorized');
        }

        // Arama
        $filters = [];
        if ($request->filled('search')) {
            $filters['search'] = $request->search;
        }

        $users = $this->userService->getPaginated($filters);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'string', 'min:10', 'confirmed', 'regex:/^(?=.*[a-zçğıöşü])(?=.*[A-ZÇĞİÖŞÜ])(?=.*\d)(?=.*[@$!%*?&])[A-Za-zçğıöşüÇĞİÖŞÜ\d@$!%*?&]{10,}$/u'],
            'rank_id' => 'required|integer|min:1|max:5',
            'status_id' => 'required|integer|min:1|max:3',
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'rank_id' => $validated['rank_id'],
            'status_id' => $validated['status_id'],
        ];

        $user = $this->userService->create($userData);

        return redirect()->route('admin.users.index')
            ->with('success', 'Kullanıcı başarıyla oluşturuldu.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'rank_id' => 'required|integer|min:1|max:5',
            'status_id' => 'required|integer|min:1|max:3',
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'rank_id' => $validated['rank_id'],
            'status_id' => $validated['status_id'],
        ];

        $updatedUser = $this->userService->update($user->id, $userData);

        if ($request->filled('password')) {
            $request->validate(['password' => ['string', 'min:10', 'confirmed', 'regex:/^(?=.*[a-zçğıöşü])(?=.*[A-ZÇĞİÖŞÜ])(?=.*\d)(?=.*[@$!%*?&])[A-Za-zçğıöşüÇĞİÖŞÜ\d@$!%*?&]{10,}$/u']]);

            $passwordData = ['password' => $request->password];
            $updatedUser = $this->userService->update($user->id, $passwordData);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'Kullanıcı başarıyla güncellendi.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Kendi hesabınızı silemezsiniz.');
        }

        $deleted = $this->userService->delete($user->id);

        return redirect()->route('admin.users.index')
            ->with('success', 'Kullanıcı başarıyla silindi.');
    }
}
