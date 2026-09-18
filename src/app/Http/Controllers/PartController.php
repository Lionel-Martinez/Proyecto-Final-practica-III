<?php

namespace App\Http\Controllers;

use App\Models\Part;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PartController extends Controller
{
    public function index(): JsonResponse
    {
        $parts = Part::query()
            ->orderBy('name')
            ->get();

        return response()->json($parts);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sku' => [
                'required',
                'string',
                'max:50',
                'unique:parts,sku',
            ],
            'name' => [
                'required',
                'string',
                'max:100',
            ],
            'current_stock' => [
                'required',
                'integer',
                'min:0',
            ],
            'minimum_stock' => [
                'required',
                'integer',
                'min:0',
            ],
            'cost_price' => [
                'required',
                'numeric',
                'min:0',
            ],
            'sale_price' => [
                'required',
                'numeric',
                'min:0',
            ],
            'category' => [
                'required',
                'string',
                'max:60',
            ],
            'icon' => [
                'required',
                'string',
                Rule::in(['pantalla', 'bateria', 'placa', 'carcasa', 'puerto', 'camara', 'accesorio', 'otro']),
            ],
        ]);

        $part = Part::create($validated);

        return response()->json($part, 201);
    }

    public function show(Part $part): JsonResponse
    {
        return response()->json($part);
    }

    public function update(Request $request, Part $part): JsonResponse
    {
        $validated = $request->validate([
            'sku' => [
                'required',
                'string',
                'max:50',
                Rule::unique('parts', 'sku')->ignore($part->id),
            ],
            'name' => [
                'required',
                'string',
                'max:100',
            ],
            'current_stock' => [
                'required',
                'integer',
                'min:0',
            ],
            'minimum_stock' => [
                'required',
                'integer',
                'min:0',
            ],
            'cost_price' => [
                'required',
                'numeric',
                'min:0',
            ],
            'sale_price' => [
                'required',
                'numeric',
                'min:0',
            ],
            'category' => [
                'required',
                'string',
                'max:60',
            ],
            'icon' => [
                'required',
                'string',
                Rule::in(['pantalla', 'bateria', 'placa', 'carcasa', 'puerto', 'camara', 'accesorio', 'otro']),
            ],
        ]);

        $part->update($validated);

        return response()->json($part->fresh());
    }

    public function destroy(Part $part): JsonResponse
    {
        $part->delete();

        return response()->json([
            'message' => 'Repuesto eliminado correctamente.',
        ]);
    }
}
