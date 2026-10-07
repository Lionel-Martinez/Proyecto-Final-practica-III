<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class ServiceController extends Controller
{
    public function view(): View
    {
        return view('catalogo');
    }

    public function index(): JsonResponse
    {
        $services = Service::orderBy('brand')->orderBy('category')->orderBy('name')->get();

        return response()->json($services->map(fn (Service $s) => $this->format($s)));
    }

    public function store(Request $request): JsonResponse
    {
        abort_unless(auth()->user()->role === 'admin', 403);

        $validated = $this->validated($request);

        $service = Service::create($validated);

        return response()->json($this->format($service), 201);
    }

    public function update(Request $request, Service $service): JsonResponse
    {
        abort_unless(auth()->user()->role === 'admin', 403);

        $validated = $this->validated($request, $service->id);

        $service->update($validated);

        return response()->json($this->format($service->fresh()));
    }

    public function destroy(Service $service): JsonResponse
    {
        abort_unless(auth()->user()->role === 'admin', 403);

        $service->delete();

        return response()->json(['message' => 'Servicio eliminado.']);
    }

    public function import(Request $request): JsonResponse
    {
        abort_unless(auth()->user()->role === 'admin', 403);

        $validated = $request->validate([
            'servicios' => ['required', 'array'],
            'servicios.*.name' => ['required', 'string', 'max:150'],
            'servicios.*.category' => ['required', 'string', 'max:100'],
            'servicios.*.reference_price' => ['required', 'numeric', 'min:0'],
        ]);

        $creados = 0;
        $actualizados = 0;

        foreach ($validated['servicios'] as $fila) {
            $service = Service::where('name', $fila['name'])->first();

            if ($service) {
                $service->update([
                    'category' => $fila['category'],
                    'reference_price' => $fila['reference_price'],
                ]);
                $actualizados++;
            } else {
                Service::create($fila);
                $creados++;
            }
        }

        return response()->json([
            'creados' => $creados,
            'actualizados' => $actualizados,
        ]);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'brand' => ['nullable', 'string', 'max:100'],
            'name' => [
                'required', 'string', 'max:150',
                Rule::unique('services', 'name')->ignore($ignoreId),
            ],
            'category' => ['required', 'string', 'max:100'],
            'reference_price' => ['required', 'numeric', 'min:0'],
        ]);
    }

    private function format(Service $s): array
    {
        return [
            'id' => $s->id,
            'brand' => $s->brand,
            'name' => $s->name,
            'category' => $s->category,
            'reference_price' => (float) $s->reference_price,
        ];
    }
}
