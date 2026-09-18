<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Part extends Model
{
    use HasFactory;

    protected $fillable = [
    'sku',
    'name',
    'category',
    'icon',
    'current_stock',
    'minimum_stock',
    'cost_price',
    'sale_price',
];

    protected $casts = [
        'current_stock' => 'integer',
        'minimum_stock' => 'integer',
        'cost_price' => 'decimal:2',
        'sale_price' => 'decimal:2',
    ];
}
