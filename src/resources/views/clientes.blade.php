@extends('layouts.ulicel')

@section('titulo', 'Clientes — Ulicel')

@section('content')

    <p class="breadcrumb">
        <a href="{{ route('dashboard') }}">Launcher</a>
        <span>/</span>
        <strong>Clientes</strong>
    </p>

    <div class="launcher-head">
        <h1>Clientes</h1>
        <p>Administrá clientes, datos de contacto y saldos pendientes.</p>
    </div>

    <div class="saldo-banner" id="saldo-banner" hidden>
        <div class="saldo-banner-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
        <div>
            <strong id="saldo-banner-title"></strong>
            <p id="saldo-banner-text"></p>
        </div>
    </div>

    <div class="inv-toolbar">
        <div class="inv-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="16.5" y1="16.5" x2="21" y2="21"></line></svg>
            <input type="text" id="search-input" placeholder="Buscar por nombre, DNI o teléfono" autocomplete="off">
        </div>
        <div class="status-toggle" id="saldo-toggle">
            <button type="button" class="status-chip active" data-filtro="todos">Todos</button>
            <button type="button" class="status-chip" data-filtro="saldo">Con saldo</button>
        </div>
        <button type="button" class="btn-solid" id="btn-nuevo-cliente">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nuevo cliente
        </button>
    </div>

    <div class="client-grid" id="client-grid"></div>

@endsection

@push('modals')
    <div class="modal-overlay" id="client-overlay" hidden>
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="client-modal-title">
            <div class="modal-head">
                <h2 id="client-modal-title">Nuevo Cliente</h2>
                <button type="button" class="modal-close" id="client-modal-close" aria-label="Cerrar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line></svg>
                </button>
            </div>
            <form id="client-form">
                <div class="modal-body">
                    <input type="hidden" id="client-id">
                    <div class="field">
                        <label for="client-nombre">Nombre completo</label>
                        <input type="text" id="client-nombre" placeholder="Ej. Carlos Arrieta">
                        <span class="field-error">Ingresá el nombre del cliente.</span>
                    </div>
                    <div class="field-row">
                        <div class="field">
                            <label for="client-dni">DNI</label>
                            <input type="text" id="client-dni" placeholder="Ej. 28550112">
                            <span class="field-error">Ingresá el DNI.</span>
                        </div>
                        <div class="field">
                            <label for="client-telefono">Teléfono</label>
                            <input type="text" id="client-telefono" placeholder="Ej. +54 9 387...">
                            <span class="field-error">Ingresá el teléfono.</span>
                        </div>
                    </div>
                    <div class="field">
                        <label for="client-email">Email</label>
                        <input type="text" id="client-email" placeholder="cliente@email.com">
                    </div>
                    <div class="field">
                        <label for="client-direccion">Dirección</label>
                        <input type="text" id="client-direccion" placeholder="Dirección del cliente">
                    </div>
                    <div class="field">
                        <label for="client-saldo">Saldo pendiente</label>
                        <input type="text" id="client-saldo" placeholder="0">
                        <span class="field-error">El saldo no puede ser negativo.</span>
                    </div>
                    <div class="modal-foot">
                        <button type="button" class="btn-ghost" id="client-cancel">Cancelar</button>
                        <button type="submit" class="btn-solid">Guardar cliente</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
@endpush

@push('styles')
    <link rel="stylesheet" href="/css/Clientes.css">
@endpush

@push('scripts')
    <script src="/js/Clientes.js"></script>
@endpush
