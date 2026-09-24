<?php

namespace App\Http\Controllers;

use App\Models\RepairOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;

class ActiveOrdersController extends Controller
{
    public function view(): View
    {
        return view('ordenes-activas');
    }

    public function index(): JsonResponse
    {
        $orders = RepairOrder::whereIn('status', ['recibido', 'en_reparacion', 'listo'])
            ->with(['device.customer', 'receivedBy'])
            ->orderByRaw("FIELD(priority, 'urgente', 'normal', 'baja')")
            ->orderBy('received_at')
            ->get();

        return response()->json($orders->map(function (RepairOrder $order) {
            return [
                'id' => $order->id,
                'cliente' => $order->device?->customer
                    ? trim($order->device->customer->first_name . ' ' . $order->device->customer->last_name)
                    : 'Cliente no disponible',
                'equipo' => $order->device
                    ? trim($order->device->brand . ' ' . $order->device->model)
                    : 'Equipo no disponible',
                'tecnico' => $order->receivedBy->name ?? '—',
                'status' => $order->status,
                'priority' => $order->priority,
                'received_at' => $order->received_at?->toISOString(),
                'customer_id' => $order->device?->customer_id,
            ];
        }));
    }
}
