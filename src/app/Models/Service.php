<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'name',
        'category',
        'reference_price',
    ];

    protected $casts = [
        'reference_price' => 'decimal:2',
    ];
}
