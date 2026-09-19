@extends('layouts.ulicel')

@section('titulo', 'Panel — Ulicel')

@section('content')

    <div class="launcher-layout">

        <div class="launcher-main">

            <div class="launcher-head">
                <p class="launcher-eyebrow">Panel de Control</p>
                <h1>Hola, {{ auth()->user()->name }}.</h1>
                <p>
                    @if (auth()->user()->role === 'admin')
                        Tenés acceso completo al sistema: gestión, ventas y configuración.
                    @elseif (auth()->user()->role === 'tecnico')
                        Accedé a las órdenes de reparación y al stock de repuestos.
                    @else
                        Accedé a clientes, proveedores y al registro de órdenes.
                    @endif
                </p>
            </div>

            <a href="{{ route('ordenes.create') }}" class="cta-banner">
                <span class="cta-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </span>
                <span class="cta-text">
                    <strong>Nueva Orden de Reparación</strong>
                    <span>Registrá cliente, equipo y foto de ingreso en un mismo paso</span>
                </span>
                <svg class="cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>

            <p class="access-heading">Accesos</p>

            <div class="access-list" id="access-list">

                @if (in_array(auth()->user()->role, ['admin', 'mostrador']))
                    <a href="{{ route('clientes.index') }}" class="access-row">
                        <span class="access-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path><circle cx="10" cy="7" r="4"></circle></svg>
                        </span>
                        <span class="access-text">
                            <strong>Clientes</strong>
                            <span>Gestión CRM</span>
                        </span>
                        <svg class="access-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </a>
                @endif

                @if (in_array(auth()->user()->role, ['admin', 'tecnico']))
                    <a href="{{ route('repuestos.index') }}" class="access-row">
                        <span class="access-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="1"></rect><path d="M3 8 5 3h14l2 5"></path><line x1="10" y1="12" x2="14" y2="12"></line></svg>
                        </span>
                        <span class="access-text">
                            <strong>Stock</strong>
                            <span>Repuestos &amp; partes</span>
                        </span>
                        @if ($lowStockCount > 0)
                            <span class="access-badge">{{ $lowStockCount }} bajo</span>
                        @endif
                        <svg class="access-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </a>
                @endif

                @if (in_array(auth()->user()->role, ['admin', 'mostrador']))
                    <a href="{{ route('proveedores.index') }}" class="access-row">
                        <span class="access-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                        </span>
                        <span class="access-text">
                            <strong>Proveedores</strong>
                            <span>Compras &amp; abastecimiento</span>
                        </span>
                        <svg class="access-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </a>
                @endif

                @if (in_array(auth()->user()->role, ['admin', 'tecnico', 'mostrador']))
                    <a href="{{ route('work-queue.index') }}" class="access-row">
                        <span class="access-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 8-8"></path><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"></path></svg>
                        </span>
                        <span class="access-text">
                            <strong>Órdenes Activas</strong>
                            <span>Work Queue</span>
                        </span>
                        <svg class="access-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </a>
                @endif

                @if (in_array(auth()->user()->role, ['admin', 'mostrador']))
                    <a href="{{ route('caja.index') }}" class="access-row">
                        <span class="access-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="3"></circle></svg>
                        </span>
                        <span class="access-text">
                            <strong>Caja/Factura</strong>
                            <span>Transacciones</span>
                        </span>
                        <svg class="access-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </a>
                @endif

                @if (auth()->user()->role === 'admin')
                    <a href="{{ route('analytics.index') }}" class="access-row">
                        <span class="access-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="21" x2="5" y2="12"></line><line x1="12" y1="21" x2="12" y2="7"></line><line x1="19" y1="21" x2="19" y2="15"></line></svg>
                        </span>
                        <span class="access-text">
                            <strong>Rentabilidad</strong>
                            <span>Métricas reales</span>
                        </span>
                        <svg class="access-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </a>
                @endif

                @foreach ([
                    ['label' => 'Prioridades', 'desc' => 'Alertas críticas'],
                ] as $pending)
                    <div class="access-row access-row-disabled">
                        <span class="access-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        </span>
                        <span class="access-text">
                            <strong>{{ $pending['label'] }}</strong>
                            <span>{{ $pending['desc'] }}</span>
                        </span>
                        <span class="access-badge access-badge-muted">Próximamente</span>
                    </div>
                @endforeach

            </div>

        </div>

        <aside class="launcher-aside">

            <div class="aside-card">
                <p class="aside-title">Resumen</p>
                <ul class="stat-list" id="stat-list">
                    @if (in_array(auth()->user()->role, ['admin', 'tecnico']))
                        <li>
                            <span>Urgentes</span>
                            <strong class="{{ $urgentOrdersCount > 0 ? 'stat-red' : '' }}">{{ $urgentOrdersCount }}</strong>
                        </li>
                    @endif
                    <li>
                        <span>Órdenes activas</span>
                        <strong>{{ $activeOrdersCount }}</strong>
                    </li>
                    @if (in_array(auth()->user()->role, ['admin', 'tecnico']))
                        <li>
                            <span>Stock bajo</span>
                            <strong class="{{ $lowStockCount > 0 ? 'stat-red' : '' }}">{{ $lowStockCount }}</strong>
                        </li>
                    @endif
                </ul>
            </div>

            <div class="aside-card console-card">
                <p class="aside-title">
                    <span class="console-dot"></span>
                    Actividad reciente
                </p>

                @if ($recentActivity->isEmpty())
                    <p class="activity-empty">Todavía no hay movimientos registrados.</p>
                @else
                    <ul class="activity-feed">
                        @foreach ($recentActivity as $order)
                            <li>
                                <span class="activity-time">{{ $order->updated_at->format('H:i') }}</span>
                                Orden #{{ $order->id }}
                                ({{ $order->device?->customer?->first_name }} {{ $order->device?->customer?->last_name }})
                                — {{ ucfirst(str_replace('_', ' ', $order->status)) }}
                            </li>
                        @endforeach
                    </ul>
                @endif
            </div>

        </aside>

    </div>

@endsection

@push('styles')
    <style>
        .access-row-disabled {
            opacity: 0.55;
            cursor: default;
        }

        .access-badge-muted {
            background: #f1f2f4;
            color: #6b7280;
        }

        .activity-empty {
            color: #8b8f97;
            font-size: 0.85rem;
        }
    </style>
@endpush
