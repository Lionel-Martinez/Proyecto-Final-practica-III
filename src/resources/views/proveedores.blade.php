@extends('layouts.ulicel')

@section('titulo', 'Proveedores — Ulicel')

@section('content')


    <div class="proveedores-page" data-api-url="{{ url('/api/proveedores') }}">
    <p class="breadcrumb">
        <a href="{{ route('dashboard') }}">Launcher</a>
        <span>/</span>
        <strong>Proveedores</strong>
    </p>

    <div class="launcher-head">
        <h1>Proveedores</h1>
        <p>Administrá los proveedores de Ulicel.</p>
    </div>

    <div class="inv-toolbar">
        <button type="button" class="btn-solid" id="add-supplier-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nuevo proveedor
        </button>
    </div>

    <section class="suppliers-section">
        <div id="suppliers-container">
            Cargando proveedores...
        </div>
    </section>

@endsection

@push('modals')
    <div id="supplier-modal" class="supplier-modal" hidden>
        <div class="supplier-modal-content" role="dialog" aria-modal="true" aria-labelledby="supplier-modal-title">
            <div class="supplier-modal-header">
                <h2 id="supplier-modal-title">Agregar proveedor</h2>
                <button type="button" id="supplier-modal-close" aria-label="Cerrar">×</button>
            </div>

            <form id="supplier-form">
                <label for="supplier-name">Nombre</label>
                <input type="text" id="supplier-name" name="name" required>

                <label for="supplier-contact">Persona de contacto</label>
                <input type="text" id="supplier-contact" name="contact_name">

                <label for="supplier-phone">Teléfono</label>
                <input type="text" id="supplier-phone" name="phone">

                <label for="supplier-email">Email</label>
                <input type="email" id="supplier-email" name="email">

                <label for="supplier-address">Dirección</label>
                <input type="text" id="supplier-address" name="address">

                <div class="supplier-modal-actions">
                    <button type="button" id="supplier-modal-cancel" class="btn-ghost">Cancelar</button>
                    <button type="submit" class="btn-solid">Guardar proveedor</button>
                </div>
            </form>
        </div>
    </div>
    </div>
@endpush

@push('styles')
    <link rel="stylesheet" href="/css/Proveedores.css">
@endpush

@push('scripts')
    <script src="/js/proveedores.js"></script>
@endpush
