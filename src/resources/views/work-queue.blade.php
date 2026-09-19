@extends('layouts.ulicel')

@section('titulo', 'Work Queue — Ulicel')

@section('content')

    <p class="breadcrumb">
        <a href="{{ route('dashboard') }}">Launcher</a>
        <span>/</span>
        <strong>Work Queue</strong>
    </p>

    <div class="launcher-head">
        <h1>Cola de Trabajo del Técnico</h1>
        <p>Arrancá una reparación y andá moviéndola por el tablero a medida que avanza.</p>
    </div>

    <div class="board" id="board" data-api-url="{{ url('/api/work-queue') }}">

        <section class="board-col" data-status="pendiente">
            <header class="board-col-head">
                <span class="board-col-title">Pendientes</span>
                <span class="board-col-count" id="count-pendiente">0</span>
            </header>
            <div class="board-col-body" id="col-pendiente"></div>
        </section>

        <section class="board-col" data-status="progreso">
            <header class="board-col-head board-col-head-progreso">
                <span class="board-col-title">En Progreso</span>
                <span class="board-col-count" id="count-progreso">0</span>
            </header>
            <div class="board-col-body" id="col-progreso"></div>
        </section>

        <section class="board-col" data-status="entregada">
            <header class="board-col-head board-col-head-done">
                <span class="board-col-title">Entregadas</span>
                <span class="board-col-count" id="count-entregada">0</span>
            </header>
            <div class="board-col-body" id="col-entregada"></div>
        </section>

    </div>

@endsection

@push('modals')
    <div class="modal-overlay" id="finalize-overlay" hidden>
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="finalize-title">

            <div class="modal-head">
                <div class="modal-head-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 8-8"></path><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"></path></svg>
                    <h2 id="finalize-title">Entrega y Finalización</h2>
                    <span class="modal-order-id" id="modal-order-id">#—</span>
                </div>
                <button type="button" class="modal-close" id="modal-close" aria-label="Cerrar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            <div class="modal-body">
                <div class="modal-block">
                    <p class="modal-block-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                        Estado al Egreso
                    </p>

                    <div class="modal-dropzone" id="modal-dropzone" tabindex="0" role="button" aria-label="Capturar foto de entrega">
                        <input type="file" id="modal-photo-input" accept="image/*" hidden>
                        <div class="modal-dropzone-empty" id="modal-dropzone-empty">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle><line x1="17" y1="8" x2="17.01" y2="8"></line></svg>
                            <strong>Capturar foto de entrega</strong>
                            <em>Evidencia visual obligatoria para garantía</em>
                        </div>
                        <img class="modal-dropzone-preview" id="modal-dropzone-preview" alt="" hidden>
                        <button type="button" class="modal-dropzone-remove" id="modal-dropzone-remove" hidden aria-label="Quitar foto">×</button>
                    </div>
                </div>
            </div>

            <div class="modal-info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span><strong>Ulicel System:</strong> el cobro y el certificado de garantía se generan desde los próximos módulos (Facturación y Garantía QR).</span>
            </div>

            <div class="modal-foot">
                <button type="button" class="modal-cancel" id="modal-cancel">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Cancelar
                </button>
                <button type="button" class="modal-confirm" id="modal-confirm">
                    <span class="modal-confirm-label">Confirmar entrega</span>
                </button>
            </div>

        </div>
    </div>
@endpush

@push('styles')
    <link rel="stylesheet" href="/css/work-queue.css">
@endpush

@push('scripts')
    <script src="/js/work-queue.js"></script>
@endpush
