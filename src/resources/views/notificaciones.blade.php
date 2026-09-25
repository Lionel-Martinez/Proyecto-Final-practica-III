@extends('layouts.ulicel')

@section('titulo', 'Notificaciones — Ulicel')

@section('content')

    <p class="breadcrumb">
        <a href="{{ route('dashboard') }}">Launcher</a>
        <span>/</span>
        <strong>Notificaciones</strong>
    </p>

    <div class="launcher-head">
        <h1>Notificaciones</h1>
        <p>Todo lo que necesita tu atención ahora mismo, en un solo lugar.</p>
    </div>

    <div class="notif-toolbar" data-api-url="{{ url('/api/notificaciones') }}" id="notif-root">
        <div class="notif-filter" id="notif-filter">
            <button type="button" class="notif-chip active" data-tipo="todos">Todas</button>
            <button type="button" class="notif-chip" data-tipo="urgente">Urgentes</button>
            <button type="button" class="notif-chip" data-tipo="stock">Stock</button>
            <button type="button" class="notif-chip" data-tipo="saldo">Saldos</button>
        </div>
        <button type="button" class="btn-ghost" id="btn-refrescar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            Actualizar
        </button>
    </div>

    <div id="notif-list-page">
        <p class="notif-empty-state">Cargando notificaciones...</p>
    </div>

@endsection

@push('styles')
    <link rel="stylesheet" href="/css/notificaciones.css">
@endpush

@push('scripts')
    <script src="/js/notificaciones.js"></script>
@endpush
