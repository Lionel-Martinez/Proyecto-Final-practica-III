<?php

namespace App\Http\Controllers;

use App\Models\RepairOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class WorkQueueController extends Controller
{
    public function view(): View
    {
        return view('work-queue');
    }

    public function index(): JsonResponse
    {
        $orders = RepairOrder::with('device.customer')
            ->whereIn('status', ['recibido', 'en_reparacion', 'listo', 'entregado'])
            ->orderByRaw("FIELD(priority, 'urgente', 'normal', 'baja')")
            ->orderBy('received_at')
            ->get();

        return response()->json(
            $orders->map(fn (RepairOrder $order) => $this->formatOrder($order))
        );
    }

    public function iniciar(RepairOrder $order): JsonResponse
    {
        abort_unless($order->status === 'recibido', 422, 'La orden no está pendiente.');

        $order->update(['status' => 'en_reparacion']);

        return response()->json($this->formatOrder($order->fresh('device.customer')));
    }

    public function entregar(Request $request, RepairOrder $order): JsonResponse
    {
        abort_if(
            in_array($order->status, ['entregado', 'cancelado']),
            422,
            'La orden ya fue entregada.'
        );

        $validated = $request->validate([
            'foto' => ['required', 'image', 'max:5120'],
        ]);

        $photoPath = $request->file('foto')->store('ordenes/egreso', 'public');

        $order->update([
            'status' => 'entregado',
            'exit_photo_path' => $photoPath,
        ]);

        return response()->json($this->formatOrder($order->fresh('device.customer')));
    }

    private function formatOrder(RepairOrder $order): array
    {
        $columna = match ($order->status) {
            'recibido' => 'pendiente',
            'en_reparacion' => 'progreso',
            'listo', 'entregado' => 'entregada',
            default => 'pendiente',
        };

        return [
            'id' => $order->id,
            'columna' => $columna,
            'status' => $order->status,
            'priority' => $order->priority,
            'reported_problem' => $order->reported_problem,
            'received_at' => $order->received_at?->toISOString(),
            'entry_photo_path' => $order->entry_photo_path,
            'exit_photo_path' => $order->exit_photo_path,
            'cliente' => $order->device?->customer
                ? trim($order->device->customer->first_name . ' ' . $order->device->customer->last_name)
                : 'Cliente no disponible',
            'customer_id' => $order->device?->customer_id,
            'equipo' => $order->device
                ? trim($order->device->brand . ' ' . $order->device->model)
                : 'Equipo no disponible',
        ];
    }
}
