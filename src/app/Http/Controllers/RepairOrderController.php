<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Device;
use App\Models\RepairOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RepairOrderController extends Controller
{
    public function index(Customer $customer): JsonResponse
    {
        $orders = RepairOrder::query()
            ->whereHas('device', function ($query) use ($customer) {
                $query->where('customer_id', $customer->id);
            })
            ->with('device')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json(
            $orders->map(fn (RepairOrder $order) => $this->formatOrder($order))
        );
    }

    public function store(Request $request, Customer $customer): JsonResponse
    {
        $validated = $request->validate([
            'device_id' => ['required', 'integer', 'exists:devices,id'],
            'reported_problem' => ['required', 'string'],
            'priority' => ['nullable', 'in:baja,normal,urgente'],
            'entry_notes' => ['nullable', 'string'],
        ]);

        $device = Device::where('id', $validated['device_id'])
            ->where('customer_id', $customer->id)
            ->firstOrFail();

        $order = RepairOrder::create([
            'device_id' => $device->id,
            'received_by' => $request->user()->id,
            'reported_problem' => $validated['reported_problem'],
            'status' => 'recibido',
            'priority' => $validated['priority'] ?? 'normal',
            'entry_notes' => $validated['entry_notes'] ?? null,
        ]);

        $order->load('device');

        return response()->json(
            $this->formatOrder($order),
            201
        );
    }

    public function update(
    Request $request,
    Customer $customer,
    RepairOrder $order
): JsonResponse {
    abort_unless(
        $order->device &&
        $order->device->customer_id === $customer->id,
        404
    );

    $validated = $request->validate([
        'status' => [
            'required',
            'in:recibido,en_reparacion,listo,entregado,cancelado',
        ],
        'technical_diagnosis' => ['nullable', 'string'],
        'entry_notes' => ['nullable', 'string'],
    ]);

    $updates = [
    'status' => $validated['status'],
];

if (array_key_exists('technical_diagnosis', $validated)) {
    $updates['technical_diagnosis'] = $validated['technical_diagnosis'];
}

if (array_key_exists('entry_notes', $validated)) {
    $updates['entry_notes'] = $validated['entry_notes'];
}

$order->update($updates);

    $order->load('device');

    return response()->json(
        $this->formatOrder($order)
    );
}

    private function formatOrder(RepairOrder $order): array
    {
        return [
            'id' => $order->id,
            'device_id' => $order->device_id,
            'dispositivo' => $order->device
                ? [
                    'id' => $order->device->id,
                    'tipo' => $order->device->type,
                    'marca' => $order->device->brand,
                    'modelo' => $order->device->model,
                ]
                : null,
            'received_by' => $order->received_by,
            'received_at' => $order->received_at?->toISOString(),
            'reported_problem' => $order->reported_problem,
            'technical_diagnosis' => $order->technical_diagnosis,
            'status' => $order->status,
            'priority' => $order->priority,
            'entry_photo_path' => $order->entry_photo_path,
            'exit_photo_path' => $order->exit_photo_path,
            'warranty_code' => $order->warranty_code,
            'warranty_expires_at' => $order->warranty_expires_at?->toDateString(),
            'entry_notes' => $order->entry_notes,
        ];
    }
}
