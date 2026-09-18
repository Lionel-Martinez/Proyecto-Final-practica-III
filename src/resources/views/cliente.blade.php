@extends('layouts.ulicel')

@section('titulo', trim($customer->first_name . ' ' . $customer->last_name) . ' — Ulicel')

@section('content')


<p class="breadcrumb">
    <a href="{{ route('dashboard') }}">Launcher</a>
    <span>/</span>
    <a href="{{ route('clientes.index') }}">Clientes</a>
    <span>/</span>
    <strong>{{ trim($customer->first_name . ' ' . $customer->last_name) }}</strong>
</p>

<div class="ficha-head">
    <div class="ficha-avatar">
        {{ strtoupper(substr($customer->first_name, 0, 1) . substr($customer->last_name, 0, 1)) }}
    </div>
    <div class="ficha-head-text">
        <h1>{{ trim($customer->first_name . ' ' . $customer->last_name) }}</h1>
        <p>DNI: {{ $customer->dni ?: 'Sin DNI' }}</p>
    </div>
    @if ($customer->outstanding_balance > 0)
        <span class="saldo-pill">Debe ${{ number_format($customer->outstanding_balance, 2, ',', '.') }}</span>
    @endif
</div>

<div class="ficha-grid">

    <div class="ficha-col">

        <div class="ficha-card">
            <p class="card-title">Contacto</p>
            <div class="dato-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92z"></path></svg>
                <span>{{ $customer->phone ?: 'Sin teléfono' }}</span>
            </div>
            @if ($customer->email)
                <div class="dato-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 6 12 13 2 6"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>
                    <span>{{ $customer->email }}</span>
                </div>
            @endif
            @if ($customer->address)
                <div class="dato-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span>{{ $customer->address }}</span>
                </div>
            @endif
        </div>

        <div class="ficha-card">
            <p class="card-title">Resumen</p>
            <div class="resumen-row">
                <span>Cliente desde</span>
                <strong>{{ $customer->created_at?->format('d/m/Y') ?: '—' }}</strong>
            </div>
            <div class="resumen-row">
                <span>Saldo pendiente</span>
                <strong>${{ number_format($customer->outstanding_balance, 2, ',', '.') }}</strong>
            </div>
        </div>

    </div>

    <div class="ficha-col ficha-col-wide">

        <div class="ficha-card">
            <div class="ficha-card-head">
                <div>
                    <p class="card-title">Dispositivos</p>
                    <p class="card-subtitle">Equipos registrados a nombre de este cliente.</p>
                </div>
                <button type="button" id="add-device-btn" class="btn-ghost">+ Agregar dispositivo</button>
            </div>
            <div id="devices-container">
                <div class="client-empty-section">Cargando dispositivos...</div>
            </div>
        </div>

        <div class="ficha-card">
            <div class="ficha-card-head">
                <div>
                    <p class="card-title">Órdenes de reparación</p>
                    <p class="card-subtitle">Historial y estado de las reparaciones de este cliente.</p>
                </div>
                <button type="button" id="add-repair-order-btn" class="btn-ghost">+ Nueva orden</button>
            </div>
            <div id="repair-orders-container">
                <div class="client-empty-section">Cargando órdenes de reparación...</div>
            </div>
        </div>

    </div>

</div>

@endsection

@push('modals')

    <div id="device-modal" class="device-modal hidden">
        <div class="device-modal-overlay" id="device-modal-overlay"></div>
        <div class="device-modal-content">
            <div class="device-modal-header">
                <div>
                    <p class="device-modal-eyebrow">Cliente</p>
                    <h2>Agregar dispositivo</h2>
                </div>
                <button type="button" id="device-modal-close" class="device-modal-close" aria-label="Cerrar">×</button>
            </div>
            <form id="device-form">
                <div class="device-form-grid">
                    <div class="device-form-group">
                        <label for="device-type">Tipo</label>
                        <select id="device-type" name="type" required>
                            <option value="">Seleccionar tipo</option>
                            <option value="Celular">Celular</option>
                            <option value="Tablet">Tablet</option>
                            <option value="Notebook">Notebook</option>
                            <option value="PC">PC</option>
                            <option value="Smartwatch">Smartwatch</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div class="device-form-group">
                        <label for="device-brand">Marca</label>
                        <input type="text" id="device-brand" name="brand" maxlength="50" required>
                    </div>
                    <div class="device-form-group">
                        <label for="device-model">Modelo</label>
                        <input type="text" id="device-model" name="model" maxlength="80" required>
                    </div>
                    <div class="device-form-group">
                        <label for="device-imei">IMEI</label>
                        <input type="text" id="device-imei" name="imei" maxlength="30" inputmode="numeric" placeholder="Opcional">
                    </div>
                </div>
                <div class="device-modal-actions">
                    <button type="button" id="device-cancel-btn" class="device-cancel-btn">Cancelar</button>
                    <button type="submit" id="device-save-btn" class="device-save-btn">Guardar dispositivo</button>
                </div>
            </form>
        </div>
    </div>

    <div id="repair-order-modal" class="device-modal hidden">
        <div class="device-modal-overlay" id="repair-order-modal-overlay"></div>
        <div class="device-modal-content">
            <div class="device-modal-header">
                <div>
                    <p class="device-modal-eyebrow">Cliente</p>
                    <h2>Nueva orden de reparación</h2>
                </div>
                <button type="button" id="repair-order-modal-close" class="device-modal-close">×</button>
            </div>
            <form id="repair-order-form">
                <div class="device-form-group">
                    <label for="repair-order-device">Dispositivo</label>
                    <select id="repair-order-device" required>
                        <option value="">Seleccioná un dispositivo</option>
                    </select>
                </div>
                <div class="device-form-group">
                    <label for="repair-order-problem">Problema reportado</label>
                    <textarea id="repair-order-problem" rows="4" required placeholder="Describí el problema informado por el cliente..."></textarea>
                </div>
                <div class="device-form-group">
                    <label for="repair-order-priority">Prioridad</label>
                    <select id="repair-order-priority" required>
                        <option value="normal">Normal</option>
                        <option value="baja">Baja</option>
                        <option value="urgente">Urgente</option>
                    </select>
                </div>
                <div class="device-form-group">
                    <label for="repair-order-notes">Notas de ingreso</label>
                    <textarea id="repair-order-notes" rows="3" placeholder="Accesorios entregados, estado físico, observaciones, etc."></textarea>
                </div>
                <div class="device-modal-actions">
                    <button type="button" id="repair-order-cancel-btn" class="device-modal-cancel">Cancelar</button>
                    <button type="submit" id="repair-order-save-btn" class="device-modal-save">Crear orden</button>
                </div>
            </form>
        </div>
    </div>

@endpush

@push('styles')
    <link rel="stylesheet" href="/css/Cliente.css">
@endpush

@push('scripts')
    <script>document.body.dataset.customerId = "{{ $customer->id }}";</script>
    <script src="/js/cliente.js"></script>
@endpush
