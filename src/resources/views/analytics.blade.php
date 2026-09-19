@extends('layouts.ulicel')

@section('titulo', 'Rentabilidad — Ulicel')

@section('content')

    <div class="analytics-head-row">
        <div>
            <p class="breadcrumb">
                <a href="{{ route('dashboard') }}">Launcher</a>
                <span>/</span>
                <strong>Rentabilidad</strong>
            </p>
            <div class="launcher-head" style="margin-bottom:0;">
                <h1>Panel de Rentabilidad</h1>
                <p>Ingresos reales de Facturación, por período.</p>
            </div>
        </div>

        <a href="{{ route('analytics.pdf', ['mes' => $mes]) }}" class="btn-pdf">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            Descargar Reporte (PDF)
        </a>
    </div>

    <div class="analytics-shell">

        <aside class="period-rail">
            <p class="rail-heading">Períodos</p>
            <div class="period-list">
                @foreach ($periodos as $p)
                    <a href="{{ route('analytics.index', ['mes' => $p['clave']]) }}" class="period-item {{ $p['activo'] ? 'active' : '' }}">
                        <strong>{{ $p['label'] }}</strong>
                        <span>{{ $p['tag'] }}</span>
                    </a>
                @endforeach
            </div>
        </aside>

        <div class="analytics-main">

            <div class="hoy-card">
                <div class="hoy-head">
                    <span class="hoy-dot"></span>
                    <p class="hoy-title">Hoy</p>
                    <span class="hoy-fecha">{{ now()->format('d/m/Y') }}</span>
                </div>
                <div class="hoy-stats">
                    <div class="hoy-stat">
                        <span class="hoy-stat-label">Trabajos de Hoy</span>
                        <strong>{{ $trabajosHoy }}</strong>
                    </div>
                    <div class="hoy-stat">
                        <span class="hoy-stat-label">Cobro Promedio ({{ $periodoLabel }})</span>
                        <strong>${{ number_format($costoPromedio, 2, ',', '.') }}</strong>
                    </div>
                </div>
                <p class="hoy-note">Trabajos de Hoy cuenta las órdenes ingresadas hoy, sin importar el período elegido arriba.</p>
            </div>

            <div class="result-card">
                <div class="result-head">
                    <span class="result-label">Resultado — {{ $periodoLabel }}</span>
                    <span class="result-pending">Costos y Ganancia: pendiente</span>
                </div>

                <div class="result-stats">
                    <div class="result-stat">
                        <span class="dot dot-ingresos"></span>
                        <div>
                            <span class="result-stat-label">Ingresos</span>
                            <strong>${{ number_format($ingresos, 2, ',', '.') }}</strong>
                        </div>
                    </div>
                    <div class="result-stat">
                        <span class="dot dot-costos"></span>
                        <div>
                            <span class="result-stat-label">Costos</span>
                            <strong>—</strong>
                            <p class="result-stat-pending">Requiere registrar repuestos usados por orden</p>
                        </div>
                    </div>
                    <div class="result-stat">
                        <span class="dot dot-ganancia"></span>
                        <div>
                            <span class="result-stat-label">Ganancia Real</span>
                            <strong>—</strong>
                            <p class="result-stat-pending">Depende de Costos</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="analytics-grid">

                <div class="panel-card">
                    <p class="card-title">Equipos más reparados</p>
                    <p class="card-subtitle">{{ $periodoLabel }} — por tipo y marca</p>

                    @if ($ranking->isEmpty())
                        <p class="ranking-empty">No hay órdenes registradas en este período.</p>
                    @else
                        <ul class="ranking-list">
                            @php $maxTickets = $ranking->max('tickets'); @endphp
                            @foreach ($ranking as $item)
                                <li>
                                    <div class="ranking-row-head">
                                        <strong>{{ $item['nombre'] }}</strong>
                                        <span>{{ $item['tickets'] }} {{ $item['tickets'] === 1 ? 'orden' : 'órdenes' }}</span>
                                    </div>
                                    <div class="ranking-bar-track">
                                        <div class="ranking-bar-fill" style="width: {{ $maxTickets > 0 ? round(($item['tickets'] / $maxTickets) * 100) : 0 }}%"></div>
                                    </div>
                                </li>
                            @endforeach
                        </ul>
                    @endif
                </div>

                <div class="panel-card">
                    <div class="orders-head">
                        <div>
                            <p class="card-title">Top Cobros del Período</p>
                            <p class="card-subtitle">{{ $periodoLabel }} — mayores transacciones</p>
                        </div>
                        <a href="{{ route('caja.index') }}" class="ver-reporte">Ver Caja →</a>
                    </div>

                    @if ($topOrdenes->isEmpty())
                        <p class="leaderboard-empty">No hay cobros registrados en este período.</p>
                    @else
                        <ul class="leaderboard">
                            @foreach ($topOrdenes as $i => $t)
                                <li>
                                    <span class="lb-rank">{{ $i + 1 }}</span>
                                    <div class="lb-info">
                                        <strong>{{ $t['cliente'] }}</strong>
                                        <span>{{ $t['equipo'] }} · {{ $t['codigo'] }}</span>
                                    </div>
                                    <div class="lb-amounts">
                                        <span class="lb-monto">${{ number_format($t['monto'], 2, ',', '.') }}</span>
                                    </div>
                                </li>
                            @endforeach
                        </ul>
                    @endif
                </div>

            </div>

        </div>

    </div>

@endsection

@push('styles')
    <link rel="stylesheet" href="/css/analytics.css">
@endpush
