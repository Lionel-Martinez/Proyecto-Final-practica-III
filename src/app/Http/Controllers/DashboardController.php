<?php

namespace App\Http\Controllers;

use App\Models\Part;
use App\Models\RepairOrder;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
    {
        $activeStatuses = ['recibido', 'en_reparacion', 'listo'];

        $activeOrdersCount = RepairOrder::whereIn('status', $activeStatuses)->count();

        $urgentOrdersCount = RepairOrder::whereIn('status', $activeStatuses)
            ->where('priority', 'urgente')
            ->count();

        $lowStockCount = Part::whereColumn('current_stock', '<=', 'minimum_stock')->count();

        $recentActivity = RepairOrder::with('device.customer')
            ->latest('updated_at')
            ->take(4)
            ->get();

        return view('dashboard', [
            'noSidebar' => true,
            'activeOrdersCount' => $activeOrdersCount,
            'urgentOrdersCount' => $urgentOrdersCount,
            'lowStockCount' => $lowStockCount,
            'recentActivity' => $recentActivity,
        ]);
    }
}
