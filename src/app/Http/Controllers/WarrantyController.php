<?php

namespace App\Http\Controllers;

use App\Models\RepairOrder;
use Illuminate\View\View;

class WarrantyController extends Controller
{
    public function show(string $warrantyCode): View
    {
        $order = RepairOrder::where('warranty_code', $warrantyCode)
            ->with(['device.customer', 'receivedBy'])
            ->firstOrFail();

        return view('garantia', ['order' => $order]);
    }
}
