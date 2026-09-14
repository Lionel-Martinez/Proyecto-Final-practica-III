<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    public function index(): JsonResponse
    {
        $customers = Customer::orderBy('id', 'desc')->get();

        return response()->json(
            $customers->map(fn (Customer $customer) => $this->formatCustomer($customer))
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:110'],
            'dni' => ['nullable', 'string', 'max:15', 'unique:customers,dni'],
            'telefono' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'direccion' => ['nullable', 'string', 'max:150'],
            'saldo' => ['nullable', 'numeric', 'min:0'],
        ]);

        [$firstName, $lastName] = $this->splitName($validated['nombre']);

        $customer = Customer::create([
            'dni' => $validated['dni'] ?? null,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'phone' => $validated['telefono'] ?? null,
            'email' => $validated['email'] ?? null,
            'address' => $validated['direccion'] ?? null,
            'outstanding_balance' => $validated['saldo'] ?? 0,
        ]);

        return response()->json(
            $this->formatCustomer($customer),
            201
        );
    }

    public function show(Customer $customer): JsonResponse
    {
        return response()->json(
            $this->formatCustomer($customer)
        );
    }

    public function update(Request $request, Customer $customer): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:110'],
            'dni' => [
                'nullable',
                'string',
                'max:15',
                Rule::unique('customers', 'dni')->ignore($customer->id),
            ],
            'telefono' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'direccion' => ['nullable', 'string', 'max:150'],
            'saldo' => ['nullable', 'numeric', 'min:0'],
        ]);

        [$firstName, $lastName] = $this->splitName($validated['nombre']);

        $customer->update([
            'dni' => $validated['dni'] ?? null,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'phone' => $validated['telefono'] ?? null,
            'email' => $validated['email'] ?? null,
            'address' => $validated['direccion'] ?? null,
            'outstanding_balance' => $validated['saldo'] ?? 0,
        ]);

        return response()->json(
            $this->formatCustomer($customer->fresh())
        );
    }

    public function destroy(Customer $customer): JsonResponse
    {
        $customer->delete();

        return response()->json([
            'message' => 'Cliente eliminado correctamente.',
        ]);
    }

    private function formatCustomer(Customer $customer): array
    {
        return [
            'id' => $customer->id,
            'nombre' => trim($customer->first_name . ' ' . $customer->last_name),
            'dni' => $customer->dni,
            'telefono' => $customer->phone,
            'email' => $customer->email,
            'direccion' => $customer->address,
            'saldo' => (float) $customer->outstanding_balance,
        ];
    }

    private function splitName(string $nombre): array
    {
        $nombre = trim(preg_replace('/\s+/', ' ', $nombre));

        if ($nombre === '') {
            return ['', ''];
        }

        $parts = explode(' ', $nombre);

        if (count($parts) === 1) {
            return [$parts[0], ''];
        }

        $lastName = array_pop($parts);
        $firstName = implode(' ', $parts);

        return [$firstName, $lastName];
    }
}
