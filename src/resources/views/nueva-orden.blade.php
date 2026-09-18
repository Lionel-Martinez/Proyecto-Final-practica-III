@extends('layouts.ulicel')

@section('titulo', 'Nueva Orden — Ulicel')

@section('content')

    <p class="breadcrumb">
        <a href="{{ route('dashboard') }}">Launcher</a>
        <span>/</span>
        <strong>Nueva Orden</strong>
    </p>

    <div class="progress-track">
        <div class="progress-fill" id="progress-fill"></div>
    </div>
    <p class="progress-label" id="progress-label">Paso 1 de 4 — Datos del cliente</p>

    <form id="wizard-form" enctype="multipart/form-data" method="POST" action="{{ route('ordenes.store') }}">
        @csrf

        <div class="wizard-shell">

            <nav class="wizard-rail">
                <button type="button" class="rail-step active" data-step="1">
                    <span class="rail-dot">1</span>
                    <span class="rail-text"><strong>Cliente</strong><span>DNI y contacto</span></span>
                </button>
                <button type="button" class="rail-step" data-step="2">
                    <span class="rail-dot">2</span>
                    <span class="rail-text"><strong>Equipo</strong><span>Tipo y problema</span></span>
                </button>
                <button type="button" class="rail-step" data-step="3">
                    <span class="rail-dot">3</span>
                    <span class="rail-text"><strong>Foto y checklist</strong><span>Estado al ingreso</span></span>
                </button>
                <button type="button" class="rail-step" data-step="4">
                    <span class="rail-dot">4</span>
                    <span class="rail-text"><strong>Revisión</strong><span>Confirmar y crear</span></span>
                </button>
            </nav>

            <div class="wizard-main">

                {{-- PASO 1: CLIENTE --}}
                <div class="wizard-panel active" data-panel="1">
                    <h2>Datos del cliente</h2>

                    <div class="field-row">
                        <div class="field">
                            <label for="dni">DNI</label>
                            <div class="input-with-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"></rect><line x1="7" y1="9" x2="11" y2="9"></line><line x1="7" y1="13" x2="13" y2="13"></line></svg>
                                <input type="text" id="dni" name="dni" placeholder="Ej: 28550112" inputmode="numeric">
                            </div>
                            <span class="field-error">Ingresá un DNI válido.</span>
                        </div>

                        <div class="field">
                            <label for="nombre">Nombre completo</label>
                            <input type="text" id="nombre" name="nombre" placeholder="Ej: Carlos Arrieta">
                            <span class="field-error">Ingresá el nombre del cliente.</span>
                        </div>
                    </div>

                    <div class="field">
                        <label for="contacto">Teléfono o email</label>
                        <input type="text" id="contacto" name="contacto" placeholder="Ej: +54 9 387... o cliente@email.com">
                    </div>

                    <p class="form-alert" id="cliente-status" hidden></p>
                </div>

                {{-- PASO 2: EQUIPO --}}
                <div class="wizard-panel" data-panel="2">
                    <h2>Datos del equipo</h2>

                    <div class="field-row-3" style="display:grid;">
                        <div class="field">
                            <label for="tipo">Tipo</label>
                            <select id="tipo" name="tipo">
                                <option value="celular">Celular</option>
                                <option value="tablet">Tablet</option>
                                <option value="notebook">Notebook</option>
                                <option value="pc">PC</option>
                                <option value="smartwatch">Smartwatch</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>
                        <div class="field">
                            <label for="marca">Marca</label>
                            <input type="text" id="marca" name="marca" placeholder="Ej: Samsung">
                            <span class="field-error">Ingresá la marca.</span>
                        </div>
                        <div class="field">
                            <label for="modelo">Modelo</label>
                            <input type="text" id="modelo" name="modelo" placeholder="Ej: Galaxy A55">
                            <span class="field-error">Ingresá el modelo.</span>
                        </div>
                    </div>

                    <div class="field">
                        <label for="problema">Problema reportado</label>
                        <textarea id="problema" name="problema" rows="3" placeholder="Describí el problema informado por el cliente..."></textarea>
                        <span class="field-error">Describí el problema reportado.</span>
                    </div>
                </div>

                {{-- PASO 3: FOTO Y CHECKLIST --}}
                <div class="wizard-panel" data-panel="3">
                    <h2>Estado al ingreso</h2>

                    <div class="intake-grid">
                        <div class="dropzone" id="dropzone" tabindex="0">
                            <input type="file" id="photo-input" name="foto" accept="image/*" hidden>
                            <div class="dropzone-empty" id="dropzone-empty">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle><line x1="17" y1="8" x2="17.01" y2="8"></line></svg>
                                <strong>Capturar / Subir foto</strong>
                                <span>Evidencia visual del estado físico actual del dispositivo</span>
                            </div>
                            <img class="dropzone-preview" id="dropzone-preview" hidden>
                            <button type="button" class="dropzone-remove" id="dropzone-remove" hidden aria-label="Quitar foto">×</button>
                        </div>

                        <div class="checklist-block">
                            <p class="checklist-title">Checklist Rápido</p>
                            <ul class="checklist" id="checklist">
                                <li><label class="check-item"><input type="checkbox" name="checklist[]" value="Pantalla trizada"><span class="check-box"></span>Pantalla trizada</label></li>
                                <li><label class="check-item"><input type="checkbox" name="checklist[]" value="Enciende dispositivo"><span class="check-box"></span>Enciende dispositivo</label></li>
                                <li><label class="check-item"><input type="checkbox" name="checklist[]" value="Diferentes rayones"><span class="check-box"></span>Diferentes rayones</label></li>
                                <li><label class="check-item"><input type="checkbox" name="checklist[]" value="Funda protectora"><span class="check-box"></span>Funda protectora</label></li>
                            </ul>

                            <div class="intake-note">
                                <span class="intake-note-tag">Nota de recepción</span>
                                <textarea id="nota" name="nota" rows="2" placeholder='"El equipo presenta desgaste habitual en bordes inferiores."'></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- PASO 4: REVISIÓN --}}
                <div class="wizard-panel" data-panel="4">
                    <h2>Revisión final</h2>
                    <p class="review-lead">Confirmá los datos antes de generar el ticket.</p>

                    <div class="review-grid">
                        <div class="review-block">
                            <p class="review-block-title">Cliente</p>
                            <p id="review-nombre">—</p>
                            <p id="review-dni">—</p>
                            <p id="review-contacto">—</p>
                        </div>
                        <div class="review-block">
                            <p class="review-block-title">Equipo</p>
                            <p id="review-equipo">—</p>
                            <p id="review-problema">—</p>
                        </div>
                        <div class="review-block">
                            <p class="review-block-title">Estado al ingreso</p>
                            <p id="review-checklist">Sin observaciones marcadas.</p>
                            <p id="review-foto">Sin foto adjunta.</p>
                        </div>
                    </div>

                    <p class="form-alert" id="submit-alert" hidden></p>
                </div>

                <div class="wizard-nav">
                    <button type="button" class="btn-ghost" id="btn-back" hidden>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 19"></polyline></svg>
                        Volver
                    </button>
                    <button type="button" class="btn-solid" id="btn-next">
                        Continuar
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                </div>

            </div>

            <aside class="wizard-context">

                <div class="context-card" data-context="1">
                    <span class="history-chip" id="history-chip" hidden></span>
                    <p class="context-text">Si el DNI ya está registrado, completamos sus datos automáticamente.</p>
                </div>

                <div class="context-card warning-card" data-context="3" hidden>
                    <p class="aside-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        Política de Privacidad
                    </p>
                    <p class="warning-text">Recordá informar al cliente sobre el borrado preventivo de datos según el tipo de intervención necesaria.</p>
                </div>

                <div class="context-card ready-card" data-context="4" hidden>
                    <p class="aside-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 8-8"></path><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"></path></svg>
                        Todo listo
                    </p>
                    <p class="warning-text">Al registrar, se genera el ticket y el cliente queda disponible en su ficha.</p>
                </div>

            </aside>

        </div>

    </form>

@endsection

@push('styles')
    <link rel="stylesheet" href="/css/nueva-orden.css">
@endpush

@push('scripts')
    <script>
        window.ULICEL_ORDER_URLS = {
            store: "{{ route('ordenes.store') }}",
            buscarCliente: "{{ route('api.ordenes.buscarCliente') }}",
        };
    </script>
    <script src="/js/nueva-orden.js"></script>
@endpush
