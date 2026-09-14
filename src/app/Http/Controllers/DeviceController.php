<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Device;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DeviceController extends Controller
{
    public function index(Customer $customer): JsonResponse
    {
        $devices = $customer->devices()
            ->orderBy('id', 'desc')
            ->get();

        return response()->json(
            $devices->map(fn (Device $device) => $this->formatDevice($device))
        );
    }

    public function store(Request $request, Customer $customer): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'string', 'max:30'],
            'brand' => ['required', 'string', 'max:50'],
            'model' => ['required', 'string', 'max:80'],
            'imei' => [
                'nullable',
                'string',
                'max:30',
                'unique:devices,imei',
            ],
        ]);

        $device = $customer->devices()->create([
            'type' => $validated['type'],
            'brand' => $validated['brand'],
            'model' => $validated['model'],
            'imei' => $validated['imei'] ?? null,
        ]);

        return response()->json(
            $this->formatDevice($device),
            201
        );
    }

    public function update(
        Request $request,
        Customer $customer,
        Device $device
    ): JsonResponse {
        abort_unless($device->customer_id === $customer->id, 404);

        $validated = $request->validate([
            'type' => ['required', 'string', 'max:30'],
            'brand' => ['required', 'string', 'max:50'],
            'model' => ['required', 'string', 'max:80'],
            'imei' => [
                'nullable',
                'string',
                'max:30',
                Rule::unique('devices', 'imei')->ignore($device->id),
            ],
        ]);

        $device->update([
            'type' => $validated['type'],
            'brand' => $validated['brand'],
            'model' => $validated['model'],
            'imei' => $validated['imei'] ?? null,
        ]);

        return response()->json(
            $this->formatDevice($device->fresh())
        );
    }

    public function destroy(
        Customer $customer,
        Device $device
    ): JsonResponse {
        abort_unless($device->customer_id === $customer->id, 404);

        $device->delete();

        return response()->json([
            'message' => 'Dispositivo eliminado correctamente.',
        ]);
    }

    private function formatDevice(Device $device): array
    {
        return [
            'id' => $device->id,
            'customer_id' => $device->customer_id,
            'type' => $device->type,
            'brand' => $device->brand,
            'model' => $device->model,
            'imei' => $device->imei,
        ];
    }
}
