<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShopSetting extends Model
{
    protected $fillable = [
        'name',
        'address',
        'phone',
        'email',
    ];

    public static function current(): self
    {
        return static::firstOrCreate(['id' => 1]);
    }
}
