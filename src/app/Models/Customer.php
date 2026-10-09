<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'dni',
        'first_name',
        'last_name',
        'phone',
        'email',
        'address',
        'outstanding_balance',
    ];

    protected $casts = [
        'outstanding_balance' => 'decimal:2',
    ];

    public function devices(): HasMany
    {
        return $this->hasMany(Device::class);
    }
}
