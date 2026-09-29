<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
##use Illuminate\Validation\Rule;

class SupplierController extends Controller
{
    public function index(): JsonResponse
    {
        $suppliers = Supplier::query()
            ->orderBy('name')
            ->get();

        return response()->json($suppliers);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'contact_name' => ['nullable', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:150'],
            'address' => ['nullable', 'string', 'max:150'],
        ]);

        $supplier = Supplier::create($validated);

        return response()->json($supplier, 201);
    }

    public function show(Supplier $supplier): JsonResponse
    {
        return response()->json($supplier);
    }

    public function update(
        Request $request,
        Supplier $supplier
    ): JsonResponse {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'contact_name' => ['nullable', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:150'],
            'address' => ['nullable', 'string', 'max:150'],
        ]);

        $supplier->update($validated);

        return response()->json($supplier->fresh());
    }

    public function destroy(Supplier $supplier): JsonResponse
    {
        $supplier->delete();

        return response()->json([
            'message' => 'Proveedor eliminado correctamente.',
        ]);
    }
        public function import(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'proveedores' => ['required', 'array'],
            'proveedores.*.name' => ['required', 'string', 'max:100'],
            'proveedores.*.contact_name' => ['nullable', 'string', 'max:100'],
            'proveedores.*.phone' => ['nullable', 'string', 'max:30'],
            'proveedores.*.email' => ['nullable', 'string', 'max:150'],
            'proveedores.*.address' => ['nullable', 'string', 'max:150'],
        ]);

        $creados = 0;
        $actualizados = 0;

        foreach ($validated['proveedores'] as $fila) {
            $supplier = Supplier::where('name', $fila['name'])->first();

            $datos = [
                'contact_name' => $fila['contact_name'] ?? null,
                'phone' => $fila['phone'] ?? null,
                'email' => $fila['email'] ?? null,
                'address' => $fila['address'] ?? null,
            ];

            if ($supplier) {
                $supplier->update($datos);
                $actualizados++;
            } else {
                Supplier::create(array_merge(['name' => $fila['name']], $datos));
                $creados++;
            }
        }

        return response()->json([
            'creados' => $creados,
            'actualizados' => $actualizados,
        ]);
    }
}
