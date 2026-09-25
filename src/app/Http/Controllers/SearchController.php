<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Part;
use App\Models\RepairOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class SearchController extends Controller
{
    public function view(): View
    {
        return view('buscar');
    }

    public function index(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));

        if ($q === '') {
            return response()->json(['clientes' => [], 'ordenes' => [], 'repuestos' => []]);
        }

        $clientes = Customer::where(function ($query) use ($q) {
            $query->where('first_name', 'like', "%{$q}%")
                ->orWhere('last_name', 'like', "%{$q}%")
                ->orWhere('dni', 'like', "%{$q}%")
                ->orWhere('phone', 'like', "%{$q}%");
        })->limit(5)->get()->map(fn (Customer $c) => [
            'id' => $c->id,
            'nombre' => trim($c->first_name . ' ' . $c->last_name),
            'dni' => $c->dni,
            'telefono' => $c->phone,
        ]);

        $ordenes = RepairOrder::with('device.customer')
            ->where(function ($query) use ($q) {
                $query->where('id', 'like', "%{$q}%")
                    ->orWhere('tracking_code', 'like', "%{$q}%")
                    ->orWhere('reported_problem', 'like', "%{$q}%");
            })
            ->limit(5)
            ->get()
            ->map(fn (RepairOrder $o) => [
                'id' => $o->id,
                'tracking_code' => $o->tracking_code,
                'cliente' => $o->device?->customer
                    ? trim($o->device->customer->first_name . ' ' . $o->device->customer->last_name)
                    : 'Cliente no disponible',
                'customer_id' => $o->device?->customer_id,
                'equipo' => $o->device ? $o->device->brand . ' ' . $o->device->model : '—',
                'status' => $o->status,
                'problema' => $o->reported_problem,
            ]);

        $repuestos = Part::where(function ($query) use ($q) {
            $query->where('name', 'like', "%{$q}%")
                ->orWhere('sku', 'like', "%{$q}%")
                ->orWhere('category', 'like', "%{$q}%");
        })->limit(5)->get()->map(fn (Part $p) => [
            'id' => $p->id,
            'nombre' => $p->name,
            'sku' => $p->sku,
            'categoria' => $p->category,
            'stock' => $p->current_stock,
        ]);

        return response()->json([
            'clientes' => $clientes,
            'ordenes' => $ordenes,
            'repuestos' => $repuestos,
        ]);
    }
}
