@extends('layouts.ulicel')

@section('titulo', 'Lista de Precios — Ulicel')

@section('content')

    @php $esAdmin = auth()->user()->role === 'admin'; @endphp

    <p class="breadcrumb">
        <a href="{{ route('dashboard') }}">Launcher</a>
        <span>/</span>
        <strong>Lista de Precios</strong>
    </p>

    <div class="launcher-head">
        <h1>Lista de Precios</h1>
        <p>Catálogo de servicios con precio de referencia, administrado por Admin. Mostrador lo usa para armar presupuestos.</p>
    </div>

    <div class="cat-toolbar" id="cat-root" data-api-url="{{ url('/api/servicios') }}" data-es-admin="{{ $esAdmin ? '1' : '0' }}">
        <div class="inv-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="search-input" placeholder="Buscar servicio o categoría...">
        </div>

        @if ($esAdmin)
            <button type="button" class="btn-ghost" id="btn-importar-excel">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Importar desde Excel
            </button>
            <input type="file" id="excel-input" accept=".xlsx,.xls,.csv" hidden>
            <button type="button" class="btn-solid" id="btn-nuevo-servicio">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Nuevo Servicio
            </button>
        @endif
    </div>

    @if ($esAdmin)
        <p class="import-hint">El Excel debe tener columnas <strong>Nombre</strong>, <strong>Categoría</strong> y <strong>Precio</strong>. Si un servicio ya existe (mismo nombre), se actualiza el precio; si no, se agrega.</p>
    @endif

    <div class="oa-table-wrap">
        <table class="oa-table">
            <thead>
                <tr>
                    <th class="col-check"></th>
                    <th>Servicio</th>
                    <th>Categoría</th>
                    <th class="num">Precio de Referencia</th>
                    @if ($esAdmin)
                        <th class="col-acciones">Acciones</th>
                    @endif
                </tr>
            </thead>
            <tbody id="cat-table-body">
                <tr class="oa-empty"><td colspan="5">Cargando servicios...</td></tr>
            </tbody>
        </table>
    </div>

    <div class="quote-bar" id="quote-bar" hidden>
        <span id="quote-count">0 servicios seleccionados</span>
        <input type="text" id="quote-cliente" placeholder="Nombre del cliente (opcional)">
        <strong id="quote-total">$0,00</strong>
        <button type="button" class="btn-solid" id="btn-generar-presupuesto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            Generar Presupuesto
        </button>
    </div>

@endsection

@if ($esAdmin)
    @push('modals')
        <div class="modal-overlay" id="servicio-overlay" hidden>
            <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="servicio-modal-title">
                <div class="modal-head">
                    <h2 id="servicio-modal-title">Nuevo Servicio</h2>
                    <button type="button" class="modal-close" id="servicio-modal-close" aria-label="Cerrar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <form id="servicio-form" class="modal-body" novalidate>
                    <input type="hidden" id="servicio-id">

                    <div class="field">
                        <label for="servicio-nombre">Nombre del servicio</label>
                        <input type="text" id="servicio-nombre" placeholder="Ej: Cambio de Display">
                        <span class="field-error">Falta el nombre.</span>
                    </div>

                    <div class="field-row">
                        <div class="field">
                            <label for="servicio-categoria">Categoría</label>
                            <input type="text" id="servicio-categoria" list="cat-categoria-options" placeholder="Ej: Pantallas">
                            <datalist id="cat-categoria-options"></datalist>
                            <span class="field-error">Falta la categoría.</span>
                        </div>
                        <div class="field">
                            <label for="servicio-precio">Precio de referencia</label>
                            <input type="text" id="servicio-precio" placeholder="Ej: 7800">
                            <span class="field-error">Ingresá un precio válido.</span>
                        </div>
                    </div>

                    <div class="modal-foot">
                        <button type="button" class="btn-ghost" id="servicio-cancel">Cancelar</button>
                        <button type="submit" class="btn-solid">Guardar Servicio</button>
                    </div>
                </form>
            </div>
        </div>
    @endpush
@endif

@push('styles')
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <link rel="stylesheet" href="/css/catalogo.css">
@endpush

@push('scripts')
    <script src="/js/catalogo.js"></script>
@endpush
