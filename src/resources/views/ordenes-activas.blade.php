@extends('layouts.ulicel')

@section('titulo', 'Órdenes Activas — Ulicel')

@section('content')

    <p class="breadcrumb">
        <a href="{{ route('dashboard') }}">Launcher</a>
        <span>/</span>
        <strong>Órdenes Activas</strong>
    </p>

    <div class="launcher-head">
        <h1>Órdenes Activas</h1>
        <p>Todas las reparaciones que todavía no fueron entregadas, en un solo lugar.</p>
    </div>

    <div class="oa-toolbar" data-api-url="{{ url('/api/ordenes-activas') }}" id="oa-root">
        <div class="inv-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="search-input" placeholder="Buscar por orden, cliente o equipo...">
        </div>

        <div class="status-toggle" id="status-toggle">
            <button type="button" class="status-chip active" data-estado="todos">Todas</button>
            <button type="button" class="status-chip" data-estado="recibido">Pendientes</button>
            <button type="button" class="status-chip" data-estado="en_reparacion">En Progreso</button>
            <button type="button" class="status-chip" data-estado="listo">Listas p/retiro</button>
            <button type="button" class="status-chip chip-urgente" data-estado="urgente">⚠ Urgentes</button>
        </div>
    </div>

    <div class="oa-table-wrap">
        <table class="oa-table">
            <thead>
                <tr>
                    <th>Orden #</th>
                    <th>Cliente</th>
                    <th>Equipo</th>
                    <th>Técnico</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                    <th>Ingreso</th>
                </tr>
            </thead>
            <tbody id="oa-table-body">
                <tr class="oa-empty"><td colspan="7">Cargando órdenes...</td></tr>
            </tbody>
        </table>
    </div>

    <p class="oa-showing" id="oa-showing">0 órdenes</p>

@endsection

@push('styles')
    <link rel="stylesheet" href="/css/ordenes-activas.css">
@endpush

@push('scripts')
    <script src="/js/ordenes-activas.js"></script>
@endpush
