<?php

namespace App\Models;

use App\Enums\UserRoleEnum;
use App\Enums\UserStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'rank_id',
        'status_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'rank_id' => UserRoleEnum::class,
            'status_id' => UserStatusEnum::class,
        ];
    }

    /**
     * Get the user's rank label.
     */
    public function getRankLabelAttribute(): string
    {
        return $this->rank_id?->label() ?? '-';
    }

    /**
     * Get the user's status label.
     */
    public function getStatusLabelAttribute(): string
    {
        return $this->status_id?->label() ?? '-';
    }
}
