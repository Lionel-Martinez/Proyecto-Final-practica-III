<?php

namespace App\Http\Controllers;

use App\Models\ShopSetting;
use Illuminate\View\View;

class QuoteController extends Controller
{
    public function view(): View
    {
        return view('presupuesto', [
            'settings' => ShopSetting::current(),
        ]);
    }
}
