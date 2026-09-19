<?php

namespace App\Http\Controllers;

use App\Models\RepairOrder;
use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\View\View;

class AnalyticsController extends Controller
{
    public function index(Request $request): View
    {
        $mes = $request->query('mes', now()->format('Y-m'));

        return view('analytics', $this->buildData($mes));
    }

    public function pdf(Request $request): Response
    {
        $mes = $request->query('mes', now()->format('Y-m'));
        $data = $this->buildData($mes);

        $pdf = Pdf::loadView('pdf.reporte-rentabilidad', $data);

        return $pdf->download('rentabilidad-' . $mes . '.pdf');
    }

    private function buildData(string $mes): array
    {
        $inicio = Carbon::createFromFormat('Y-m', $mes)->startOfMonth();
        $fin = $inicio->copy()->endOfMonth();

        $periodos = collect(range(0, 5))->map(function ($i) use ($mes) {
            $fecha = now()->subMonths($i);
            $clave = $fecha->format('Y-m');

            return [
                'clave' => $clave,
                'label' => ucfirst($fecha->translatedFormat('F Y')),
                'tag' => $i === 0 ? 'Mes actual' : ($i === 1 ? 'Mes anterior' : "Hace {$i} meses"),
                'activo' => $clave === $mes,
            ];
        });

        $ingresos = Transaction::whereBetween('created_at', [$inicio, $fin])->sum('amount');

        $trabajosHoy = RepairOrder::whereDate('received_at', today())->count();

        $costoPromedio = Transaction::whereBetween('created_at', [$inicio, $fin])->avg('amount') ?? 0;

        $ranking = RepairOrder::whereBetween('received_at', [$inicio, $fin])
            ->with('device')
            ->get()
            ->groupBy(fn ($order) => $order->device?->type . ' — ' . $order->device?->brand)
            ->map(fn ($grupo, $nombre) => ['nombre' => $nombre, 'tickets' => $grupo->count()])
            ->sortByDesc('tickets')
            ->take(5)
            ->values();

        $topOrdenes = Transaction::whereBetween('created_at', [$inicio, $fin])
            ->with(['customer', 'repairOrder.device'])
            ->orderByDesc('amount')
            ->take(5)
            ->get()
            ->map(fn (Transaction $t) => [
                'codigo' => $t->code,
                'cliente' => $t->customer ? trim($t->customer->first_name . ' ' . $t->customer->last_name) : '—',
                'equipo' => $t->repairOrder?->device ? $t->repairOrder->device->brand . ' ' . $t->repairOrder->device->model : '—',
                'monto' => (float) $t->amount,
            ]);

        return [
            'mes' => $mes,
            'periodos' => $periodos,
            'periodoLabel' => $periodos->firstWhere('clave', $mes)['label'] ?? $mes,
            'ingresos' => (float) $ingresos,
            'trabajosHoy' => $trabajosHoy,
            'costoPromedio' => (float) $costoPromedio,
            'ranking' => $ranking,
            'topOrdenes' => $topOrdenes,
        ];
    }
}
