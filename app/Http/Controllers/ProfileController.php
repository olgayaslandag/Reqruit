<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        // Check if user is admin/manager to show rank_id and status_id
        $user = $request->user();

        // Determine show condition: admin (1) or ik manager (2)
        $rankValue = is_object($user->rank_id) ? $user->rank_id->value : $user->rank_id;
        $showAdvancedInfo = in_array($rankValue, [1, 2]);

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'showAdvancedInfo' => $showAdvancedInfo,
            'advancedUserInfo' => $showAdvancedInfo ? [
                'rank_id' => $rankValue,
                'rank_label' => $this->getRankLabel($rankValue),
                'status_id' => is_object($user->status_id) ? $user->status_id->value : $user->status_id,
                'status_label' => $this->getStatusLabel(is_object($user->status_id) ? $user->status_id->value : $user->status_id),
            ] : null,
        ]);
    }

    /**
     * Get rank label based on rank_id
     */
    private function getRankLabel($rankId): string
    {
        return match ($rankId) {
            1 => 'Yönetici',
            2 => 'İK Yöneticisi',
            3 => 'İşe Alım Uzmanı',
            4 => 'Departman Sorumlusu',
            5 => 'Gözlemci',
            default => 'Bilinmeyen Rol',
        };
    }

    /**
     * Get status label based on status_id
     */
    private function getStatusLabel($statusId): string
    {
        return match ($statusId) {
            1 => 'Aktif',
            2 => 'Pasif',
            3 => 'Beklemede',
            default => 'Bilinmeyen Durum',
        };
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
