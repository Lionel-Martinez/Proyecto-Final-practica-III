@extends('layouts.ulicel')

@section('titulo', 'Buscar — Ulicel')

@section('content')

    <p class="breadcrumb">
        <a href="{{ route('dashboard') }}">Launcher</a>
        <span>/</span>
        <strong>Buscar</strong>
    </p>

    <div class="buscar-head">
        <div class="buscar-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="buscar-input" placeholder="Buscar cliente, orden, repuesto..." autofocus data-api-url="{{ url('/api/buscar') }}">
        </div>
        <p class="buscar-hint">Cruza Clientes, Órdenes y Repuestos a la vez.</p>
    </div>

    <div id="buscar-resultados">
        <p class="buscar-empty">Empezá a escribir para buscar en todo el sistema.</p>
    </div>

@endsection

@push('styles')
    <link rel="stylesheet" href="/css/buscar.css">
@endpush

@push('scripts')
    <script src="/js/buscar.js"></script>
@endpush
