@extends('layouts.ulicel')

@section('titulo', 'Caja / Factura — Ulicel')

@section('content')

    <p class="breadcrumb">
        <a href="{{ route('dashboard') }}">Launcher</a>
        <span>/</span>
        <strong>Caja / Factura</strong>
    </p>

    <div class="launcher-head">
        <h1>Caja y Facturación</h1>
        <p>Registrá cobros y generá el comprobante con código único para cada transacción.</p>
    </div>

    <div class="caja-stats">
        <div class="stat-card stat-card-dark">
            <span class="stat-label">Cobrado Hoy</span>
            <p class="stat-value" id="stat-hoy">$0,00</p>
        </div>
        <div class="stat-card">
            <span class="stat-label">Cobrado Este Mes</span>
            <p class="stat-value" id="stat-mes">$0,00</p>
        </div>
        <div class="stat-card">
            <span class="stat-label">Transacciones</span>
            <p class="stat-value" id="stat-cantidad">0</p>
        </div>
    </div>

    <div class="caja-grid">

        <div class="caja-main">

            <div class="caja-toolbar">
                <div class="inv-search">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="16.5" y1="16.5" x2="21" y2="21"></line></svg>
                    <input type="text" id="search-input" placeholder="Buscar por cliente o código...">
                </div>
                <button type="button" class="btn-solid" id="btn-nuevo-cobro">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Registrar cobro
                </button>
            </div>

            <div class="oa-table-wrap">
                <table class="oa-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Cliente</th>
                            <th>Orden</th>
                            <th>Método</th>
                            <th>Fecha</th>
                            <th class="num">Monto</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="tx-tbody">
                        <tr class="oa-empty"><td colspan="7">Cargando transacciones...</td></tr>
                    </tbody>
                </table>
            </div>

        </div>

        <aside class="metodos-card">
            <p class="card-title">Métodos de Pago</p>
            <p class="card-subtitle">Distribución del período</p>
            <ul class="metodos-list" id="metodos-list">
                <li class="metodos-empty">Sin datos todavía.</li>
            </ul>
        </aside>

    </div>

@endsection

@push('modals')
    <div class="modal-overlay" id="tx-overlay" hidden>
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="tx-modal-title">
            <div class="modal-head">
                <h2 id="tx-modal-title">Registrar Cobro</h2>
                <button type="button" class="modal-close" id="tx-modal-close" aria-label="Cerrar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line></svg>
                </button>
            </div>

            <form id="tx-form" class="modal-body" novalidate>
                <div class="field">
                    <label for="tx-cliente">Cliente</label>
                    <select id="tx-cliente">
                        <option value="">Seleccioná un cliente</option>
                    </select>
                    <span class="field-error">Elegí un cliente.</span>
                </div>

                <div class="field">
                    <label for="tx-orden">Orden de reparación (opcional)</label>
                    <select id="tx-orden" disabled>
                        <option value="">Elegí un cliente primero</option>
                    </select>
                </div>

                <div class="field-row">
                    <div class="field">
                        <label for="tx-monto">Monto</label>
                        <input type="number" id="tx-monto" min="0.01" step="0.01" placeholder="Ej: 5370">
                        <span class="field-error">Ingresá un monto válido.</span>
                    </div>

                    <div class="field">
                        <label for="tx-metodo">Método de pago</label>
                        <select id="tx-metodo">
                            <option value="Efectivo">Efectivo</option>
                            <option value="Transferencia">Transferencia</option>
                            <option value="Débito">Débito</option>
                            <option value="Crédito">Crédito</option>
                        </select>
                    </div>
                </div>

                <div class="modal-foot">
                    <button type="button" class="btn-ghost" id="tx-cancel">Cancelar</button>
                    <button type="submit" class="btn-solid" id="tx-save">Registrar cobro</button>
                </div>
            </form>
        </div>
    </div>
@endpush

@push('styles')
    <link rel="stylesheet" href="/css/caja-factura.css">
@endpush

@push('scripts')
    <script>
        window.ULICEL_CAJA_URLS = {
            transacciones: "{{ route('api.transacciones.index') }}",
            clientes: "{{ route('api.clientes.index') }}",
        };
    </script>
    <script src="/js/caja-factura.js"></script>
@endpush
