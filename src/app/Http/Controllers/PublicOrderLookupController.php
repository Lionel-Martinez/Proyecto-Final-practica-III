<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PublicOrderLookupController extends Controller
{
    public function view(): View
    {
        return view('buscar-orden');
    }

    public function search(Request $request): JsonResponse
    {
        $dni = trim((string) $request->query('dni', ''));

        if ($dni === '') {
            return response()->json(['encontrado' => false]);
        }

        $customer = Customer::where('dni', $dni)->first();

        if (! $customer) {
            return response()->json(['encontrado' => false]);
        }

        $ordenes = $customer->devices()
            ->with(['repairOrders' => fn ($q) => $q->whereNotNull('tracking_code')->latest('received_at')])
            ->get()
            ->pluck('repairOrders')
            ->flatten()
            ->map(fn ($order) => [
                'tracking_code' => $order->tracking_code,
                'equipo' => $order->device ? "{$order->device->brand} {$order->device->model}" : '—',
                'status' => $order->status,
                'received_at' => $order->received_at?->format('d/m/Y'),
            ]);

        return response()->json([
            'encontrado' => true,
            'nombre' => trim($customer->first_name),
            'ordenes' => $ordenes->values(),
        ]);
    }
}
