<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\RepairOrder;
use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\View\View;

class TransactionController extends Controller
{
    public function view(): View
    {
        return view('caja-factura');
    }

    public function index(): JsonResponse
    {
        $transactions = Transaction::with(['customer', 'repairOrder'])
            ->orderByDesc('created_at')
            ->get();

        $hoy = $transactions->filter(fn ($t) => $t->created_at->isToday());
        $esteMes = $transactions->filter(fn ($t) => $t->created_at->isCurrentMonth());

        $porMetodo = $transactions->groupBy('method')->map(function ($grupo) use ($transactions) {
            $total = $grupo->sum('amount');
            return [
                'total' => (float) $total,
                'cantidad' => $grupo->count(),
                'porcentaje' => $transactions->sum('amount') > 0
                    ? round(($total / $transactions->sum('amount')) * 100, 1)
                    : 0,
            ];
        });

        return response()->json([
            'stats' => [
                'cobrado_hoy' => (float) $hoy->sum('amount'),
                'cobrado_mes' => (float) $esteMes->sum('amount'),
                'transacciones' => $transactions->count(),
            ],
            'por_metodo' => $porMetodo,
            'transacciones' => $transactions->map(fn (Transaction $t) => $this->formatTransaction($t)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'repair_order_id' => ['nullable', 'integer', 'exists:repair_orders,id'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'method' => ['required', 'in:Efectivo,Transferencia,Débito,Crédito'],
        ]);

        if (! empty($validated['repair_order_id'])) {
            $order = RepairOrder::with('device')->findOrFail($validated['repair_order_id']);

            abort_unless(
                $order->device && $order->device->customer_id == $validated['customer_id'],
                422,
                'La orden seleccionada no pertenece a ese cliente.'
            );
        }

        $transaction = Transaction::create([
            'code' => 'PENDIENTE',
            'customer_id' => $validated['customer_id'],
            'repair_order_id' => $validated['repair_order_id'] ?? null,
            'registered_by' => $request->user()->id,
            'amount' => $validated['amount'],
            'method' => $validated['method'],
        ]);

        $transaction->update([
            'code' => 'FAC-' . now()->year . '-' . str_pad($transaction->id, 6, '0', STR_PAD_LEFT),
        ]);

        $transaction->load(['customer', 'repairOrder']);

        return response()->json($this->formatTransaction($transaction), 201);
    }

    public function download(Transaction $transaction): Response
    {
        $transaction->load(['customer', 'repairOrder.device', 'registeredBy']);

        $pdf = Pdf::loadView('pdf.factura', ['transaction' => $transaction]);

        return $pdf->download("{$transaction->code}.pdf");
    }

    private function formatTransaction(Transaction $t): array
    {
        return [
            'id' => $t->id,
            'code' => $t->code,
            'cliente' => $t->customer
                ? trim($t->customer->first_name . ' ' . $t->customer->last_name)
                : 'Cliente eliminado',
            'customer_id' => $t->customer_id,
            'orden_id' => $t->repair_order_id,
            'amount' => (float) $t->amount,
            'method' => $t->method,
            'fecha' => $t->created_at->toISOString(),
        ];
    }
}
