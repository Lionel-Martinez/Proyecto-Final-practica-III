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
            <button type="button" class="btn-ghost" id="btn-importar-proveedores">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Importar desde Excel
            </button>
            <input type="file" id="proveedores-excel-input" accept=".xlsx,.xls,.csv" hidden>

            <button type="button" class="btn-solid" id="add-supplier-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Nuevo proveedor
            </button>
        </div>

        <p style="margin: 0 0 1.3rem; font-size: 0.80rem; color: #8b8f97;">
            El Excel debe tener columnas <strong>Nombre</strong>, <strong>Contacto</strong>, <strong>Teléfono</strong>, <strong>Email</strong> y <strong>Dirección</strong>. Si un proveedor ya existe (mismo nombre), se actualizan sus datos.
        </p>

        <section class="suppliers-section">
            <div id="suppliers-container">
                Cargando proveedores...
            </div>
        </section>

    </div>

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
@endpush

@push('styles')
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <link rel="stylesheet" href="/css/Proveedores.css">
@endpush

@push('scripts')
    <script src="/js/proveedores.js"></script>
@endpush
