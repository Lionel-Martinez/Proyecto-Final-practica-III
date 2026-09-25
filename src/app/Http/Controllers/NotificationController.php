<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Part;
use App\Models\RepairOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;

class NotificationController extends Controller
{
    public function view(): View
    {
        return view('notificaciones');
    }

    public function index(): JsonResponse
    {
        return response()->json($this->build());
    }

    private function build(): array
    {
        $notificaciones = [];

        $urgentes = RepairOrder::where('status', 'recibido')
            ->where('priority', 'urgente')
            ->with('device.customer')
            ->get();

        foreach ($urgentes as $order) {
            $cliente = $order->device?->customer
                ? trim($order->device->customer->first_name . ' ' . $order->device->customer->last_name)
                : 'Cliente no disponible';

            $notificaciones[] = [
                'tipo' => 'urgente',
                'titulo' => "Orden #{$order->id} urgente sin iniciar",
                'detalle' => "{$cliente} — {$order->reported_problem}",
                'href' => $order->device?->customer_id ? "/clientes/{$order->device->customer_id}" : '/work-queue',
            ];
        }

        $stockBajo = Part::whereColumn('current_stock', '<=', 'minimum_stock')->get();

        foreach ($stockBajo as $part) {
            $notificaciones[] = [
                'tipo' => 'stock',
                'titulo' => "{$part->name} con stock bajo",
                'detalle' => "Quedan {$part->current_stock} unidades (mínimo {$part->minimum_stock})",
                'href' => '/repuestos',
            ];
        }

        $conSaldo = Customer::where('outstanding_balance', '>', 0)->get();

        foreach ($conSaldo as $customer) {
            $nombre = trim($customer->first_name . ' ' . $customer->last_name);

            $notificaciones[] = [
                'tipo' => 'saldo',
                'titulo' => "{$nombre} tiene saldo pendiente",
                'detalle' => '$' . number_format($customer->outstanding_balance, 2, ',', '.'),
                'href' => "/clientes/{$customer->id}",
            ];
        }

        return $notificaciones;
    }
}
