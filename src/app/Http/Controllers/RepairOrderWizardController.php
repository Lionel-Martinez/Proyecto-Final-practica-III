<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Device;
use App\Models\RepairOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class RepairOrderWizardController extends Controller
{
    public function create(): View
    {
        return view('nueva-orden', ['noSidebar' => false]);
    }

    public function confirmacion(RepairOrder $order): View
    {
        $order->load('device.customer');

        return view('orden-confirmacion', compact('order'));
    }

    public function seguimiento(string $trackingCode): View
    {
        $order = RepairOrder::where('tracking_code', $trackingCode)
            ->with([
                'device.customer',
                'updates' => fn ($query) => $query->latest(),
            ])
            ->firstOrFail();

        return view('seguimiento', ['order' => $order, 'noSidebar' => true]);
    }

    public function buscarCliente(Request $request): JsonResponse
    {
        $dni = $request->query('dni');

        if (! $dni) {
            return response()->json(['encontrado' => false]);
        }

        $customer = Customer::where('dni', $dni)->first();

        if (! $customer) {
            return response()->json(['encontrado' => false]);
        }

        return response()->json([
            'encontrado' => true,
            'cliente' => [
                'id' => $customer->id,
                'nombre' => trim($customer->first_name . ' ' . $customer->last_name),
                'telefono' => $customer->phone,
                'email' => $customer->email,
                'visitas_previas' => $customer->devices()
                    ->withCount('repairOrders')
                    ->get()
                    ->sum('repair_orders_count'),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'dni' => ['nullable', 'string', 'max:15'],
            'nombre' => ['required', 'string', 'max:110'],
            'telefono' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'tipo' => ['required', 'string', 'max:30'],
            'marca' => ['required', 'string', 'max:50'],
            'modelo' => ['required', 'string', 'max:80'],
            'problema' => ['required', 'string', 'max:280'],
            'servicio_id' => ['nullable', 'integer', 'exists:services,id'],
            'checklist' => ['nullable', 'array'],
            'checklist.*' => ['string'],
            'nota' => ['nullable', 'string'],
            'foto' => ['required', 'image', 'max:5120'],
        ]);

        $order = DB::transaction(function () use ($validated, $request) {

            $customer = Customer::where('dni', $validated['dni'] ?? null)
                ->when(empty($validated['dni']), fn ($query) => $query->whereRaw('1 = 0'))
                ->first();

            if (! $customer) {
                $nameParts = preg_split('/\s+/', trim($validated['nombre']));
                $lastName = count($nameParts) > 1 ? array_pop($nameParts) : '';
                $firstName = implode(' ', $nameParts) ?: $validated['nombre'];

                $customer = Customer::create([
                    'dni' => $validated['dni'] ?? null,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'phone' => $validated['telefono'] ?? null,
                    'email' => $validated['email'] ?? null,
                    'outstanding_balance' => 0,
                ]);
            } else {
                $customer->update([
                    'phone' => $validated['telefono'] ?? $customer->phone,
                    'email' => $validated['email'] ?? $customer->email,
                ]);
            }

            $device = Device::create([
                'customer_id' => $customer->id,
                'type' => ucfirst($validated['tipo']),
                'brand' => $validated['marca'],
                'model' => $validated['modelo'],
            ]);

            $entryNotes = $this->buildEntryNotes(
                $validated['checklist'] ?? [],
                $validated['nota'] ?? null
            );

            $photoPath = null;

            if ($request->hasFile('foto')) {
                $photoPath = $request->file('foto')->store('ordenes/ingreso', 'public');
            }

            $servicio = ! empty($validated['servicio_id'])
                ? \App\Models\Service::find($validated['servicio_id'])
                : null;

            $order = RepairOrder::create([
                'device_id' => $device->id,
                'service_id' => $servicio?->id,
                'estimated_price' => $servicio?->reference_price,
                'received_by' => $request->user()->id,
                'received_at' => now(),
                'reported_problem' => $validated['problema'],
                'status' => 'recibido',
                'priority' => 'normal',
                'entry_notes' => $entryNotes,
                'entry_photo_path' => $photoPath,
            ]);

            $order->update([
                'tracking_code' => 'UL-' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
            ]);
            $order->updates()->create([
                'user_id' => $request->user()->id,
                'status' => 'recibido',
                'message' => 'El equipo ingresó al taller.',
            ]);

            return $order;
        });

        return redirect()->route('ordenes.confirmacion', $order->id);
    }

    private function buildEntryNotes(array $checklist, ?string $nota): ?string
    {
        $parts = [];

        if (! empty($checklist)) {
            $parts[] = 'Checklist: ' . implode(', ', $checklist);
        }

        if ($nota) {
            $parts[] = $nota;
        }

        return $parts ? implode(' | ', $parts) : null;
    }
}
