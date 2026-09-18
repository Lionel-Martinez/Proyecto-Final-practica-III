@extends('layouts.ulicel')

@section('titulo', 'Repuestos — Ulicel')

@section('content')

<div class="repuestos-page" data-api-url="{{ url('/api/repuestos') }}">

    <p class="breadcrumb">
        <a href="{{ route('dashboard') }}">Launcher</a>
        <span>/</span>
        <strong>Inventario</strong>
    </p>

    <div class="launcher-head">
        <h1>Inventario de Repuestos</h1>
        <p>Navegá el almacén por categoría y controlá el nivel de stock de cada repuesto.</p>
    </div>

    <div class="inv-shell">

        <aside class="inv-rail">

            <div class="rail-stat">
                <span class="rail-stat-label">Valor Total Almacén</span>
                <p class="rail-stat-value" id="valor-total">$0.00</p>
            </div>

            <p class="rail-heading">Categorías</p>
            <div class="category-list" id="category-list"></div>

            <div class="rail-alert" id="rail-alert">
                <div class="rail-alert-head">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    <strong>Stock Bajo</strong>
                </div>
                <p id="alert-text">Revisando inventario...</p>
                <div class="alert-chips" id="alert-chips"></div>
            </div>

        </aside>

        <div class="inv-main">

            <div class="inv-toolbar">

                <div class="inv-search">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" id="inv-search-input" placeholder="Buscar repuesto o SKU...">
                </div>

                <div class="status-toggle" id="status-toggle">
                    <button type="button" class="status-chip active" data-estado="todos">Todos</button>
                    <button type="button" class="status-chip" data-estado="normal">Normal</button>
                    <button type="button" class="status-chip" data-estado="agotandose">Agotándose</button>
                </div>

                <button type="button" class="icon-btn" id="export-btn" aria-label="Exportar a CSV" title="Exportar a CSV">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </button>

                <button type="button" class="btn-solid" id="btn-nuevo-repuesto">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Nuevo Repuesto
                </button>

            </div>

            <div class="bin-grid" id="bin-grid"></div>

            <div class="inv-foot">
                <span id="inv-showing">Mostrando 0-0 de 0 repuestos</span>
                <div class="pagination" id="pagination"></div>
            </div>

        </div>

    </div>

</div>

@endsection

@push('modals')
    <div class="modal-overlay" id="part-overlay" hidden>
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="part-modal-title">
            <div class="modal-head">
                <h2 id="part-modal-title">Nuevo Repuesto</h2>
                <button type="button" class="modal-close" id="part-modal-close" aria-label="Cerrar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            <form id="part-form" class="modal-body" novalidate>
                <input type="hidden" id="part-id">

                <div class="field">
                    <label for="part-nombre">Nombre del repuesto</label>
                    <input type="text" id="part-nombre" placeholder="Ej: Pantalla Samsung Galaxy A55">
                    <span class="field-error">Falta el nombre.</span>
                </div>

                <div class="field-row">
                    <div class="field">
                        <label for="part-sku">SKU</label>
                        <input type="text" id="part-sku" placeholder="Ej: PANT-A55">
                        <span class="field-error">Falta el SKU.</span>
                    </div>
                    <div class="field">
                        <label for="part-categoria">Categoría</label>
                        <select id="part-categoria">
                            <option value="Pantallas" data-icon="pantalla">Pantallas</option>
                            <option value="Baterías" data-icon="bateria">Baterías</option>
                            <option value="Placas y componentes" data-icon="placa">Placas y componentes</option>
                            <option value="Carcasas y estructura" data-icon="carcasa">Carcasas y estructura</option>
                            <option value="Puertos y conectores" data-icon="puerto">Puertos y conectores</option>
                            <option value="Cámaras" data-icon="camara">Cámaras</option>
                            <option value="Accesorios y herramientas" data-icon="accesorio">Accesorios y herramientas</option>
                            <option value="Otros" data-icon="otro">Otros</option>
                        </select>
                    </div>
                </div>

                <div class="field-row">
                    <div class="field">
                        <label for="part-stock">Stock actual</label>
                        <input type="number" id="part-stock" min="0" value="0">
                        <span class="field-error">Ingresá una cantidad válida.</span>
                    </div>
                    <div class="field">
                        <label for="part-stock-minimo">Stock mínimo</label>
                        <input type="number" id="part-stock-minimo" min="0" value="0">
                        <span class="field-error">Ingresá una cantidad válida.</span>
                    </div>
                </div>

                <div class="field-row">
                    <div class="field">
                        <label for="part-costo">Precio de costo</label>
                        <input type="number" id="part-costo" min="0" step="0.01" value="0">
                        <span class="field-error">Ingresá un precio válido.</span>
                    </div>
                    <div class="field">
                        <label for="part-venta">Precio de venta</label>
                        <input type="number" id="part-venta" min="0" step="0.01" value="0">
                        <span class="field-error">Ingresá un precio válido.</span>
                    </div>
                </div>

                <div class="modal-foot">
                    <button type="button" class="btn-ghost" id="part-cancel">Cancelar</button>
                    <button type="submit" class="btn-solid" id="part-save">Guardar Repuesto</button>
                </div>
            </form>
        </div>
    </div>
@endpush

@push('styles')
    <link rel="stylesheet" href="/css/Repuestos.css">
@endpush

@push('scripts')
    <script src="/js/repuestos.js"></script>
@endpush
