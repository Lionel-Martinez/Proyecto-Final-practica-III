@php
    $settings = \App\Models\ShopSetting::current();
    $cliente = $order->device->customer;
    $nombreCliente = trim($cliente->first_name . ' ' . $cliente->last_name);
    $fechaIngreso = ($order->received_at ?? $order->created_at)->copy()->timezone('America/Argentina/Salta');
    $urlSeguimiento = $order->tracking_code ? route('ordenes.seguimiento', $order->tracking_code) : null;
    $contactoTaller = collect([$settings->phone, $settings->email])->filter()->implode(' · ');
@endphp
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprobante de ingreso #{{ $order->id }} — {{ $settings->name ?: 'Ulicel' }}</title>
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; font-family: "Segoe UI", Arial, sans-serif; background: #eef0f3; color: #14161a; }

        .toolbar { max-width: 46rem; margin: 1.5rem auto 0; padding: 0 1rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
        .toolbar-msg { display: flex; align-items: center; gap: 0.6rem; font-weight: 700; color: #1a7d3c; font-size: 0.92rem; }
        .toolbar-msg svg { width: 1.4rem; height: 1.4rem; flex-shrink: 0; }
        .toolbar-actions { display: flex; gap: 0.6rem; flex-wrap: wrap; }
        .btn { display: inline-flex; align-items: center; justify-content: center; height: 2.6rem; padding: 0 1.1rem; border-radius: 0.5rem; font-size: 0.88rem; font-weight: 700; text-decoration: none; cursor: pointer; border: 1px solid #d7dce2; background: #fff; color: #14161a; font-family: inherit; }
        .btn:hover { border-color: #b3b8bf; }
        .btn-primary { background: #14161a; color: #fff; border-color: #14161a; }
        .btn-primary:hover { background: #b80f22; border-color: #b80f22; }

        .sheet { max-width: 46rem; margin: 1.2rem auto 2.5rem; background: #fff; border-radius: 0.9rem; box-shadow: 0 20px 44px rgba(20, 22, 26, 0.12); padding: 2rem 2.2rem; }

        .sheet-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1.5rem; padding-bottom: 1.2rem; border-bottom: 2px solid #14161a; }
        .brand { display: flex; align-items: center; gap: 0.9rem; }
        .brand img { width: 3.4rem; height: 3.4rem; border-radius: 0.6rem; object-fit: cover; }
        .brand h1 { margin: 0; font-size: 1.35rem; font-weight: 800; }
        .brand p { margin: 0.15rem 0 0; font-size: 0.78rem; color: #6b7280; line-height: 1.4; }
        .doc-id { text-align: right; }
        .doc-kicker { display: block; font-family: "Courier New", monospace; font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; color: #8b8f97; }
        .doc-id strong { display: block; font-size: 1.5rem; font-weight: 800; color: #b80f22; margin: 0.15rem 0; }
        .doc-date { font-family: "Courier New", monospace; font-size: 0.8rem; color: #4b5563; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.4rem; margin-top: 1.3rem; }
        .block-label { margin: 0 0 0.35rem; font-family: "Courier New", monospace; font-size: 0.68rem; letter-spacing: 0.07em; text-transform: uppercase; color: #8b8f97; font-weight: 700; }
        .block-value { margin: 0 0 0.2rem; font-size: 0.95rem; font-weight: 700; }
        .block-sub { margin: 0 0 0.15rem; font-size: 0.84rem; color: #4b5563; }

        .section { margin-top: 1.3rem; padding-top: 1.1rem; border-top: 1px dashed #d7dce2; }
        .section .text { margin: 0; font-size: 0.9rem; line-height: 1.5; }

        .quote-box { display: flex; align-items: center; justify-content: space-between; gap: 1rem; background: #f9fafb; border: 1px solid #ececec; border-radius: 0.6rem; padding: 0.9rem 1.1rem; }
        .q-name { font-size: 0.9rem; font-weight: 700; }
        .q-price { font-family: "Courier New", monospace; font-size: 1.25rem; font-weight: 800; white-space: nowrap; }
        .quote-note { margin: 0.5rem 0 0; font-size: 0.76rem; color: #8b8f97; line-height: 1.45; }

        .track { display: flex; align-items: center; gap: 1.4rem; }
        .track-qr svg { width: 8.5rem; height: 8.5rem; display: block; }
        .track-code { margin: 0 0 0.2rem; font-family: "Courier New", monospace; font-size: 1.4rem; font-weight: 800; letter-spacing: 0.05em; }
        .track-text { margin: 0 0 0.3rem; font-size: 0.85rem; color: #4b5563; line-height: 1.45; }
        .track-url { margin: 0; font-size: 0.72rem; color: #9aa0a8; word-break: break-all; }

        .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; margin-top: 2.6rem; }
        .sign-line { border-top: 1px solid #14161a; padding-top: 0.4rem; text-align: center; font-size: 0.78rem; color: #4b5563; }
        .foot { margin: 1.4rem 0 0; text-align: center; font-size: 0.72rem; color: #9aa0a8; }

        @page { size: A4; margin: 12mm; }

        @media print {
            body { background: #fff; }
            .no-print { display: none !important; }
            .sheet { box-shadow: none; margin: 0; max-width: none; border-radius: 0; padding: 0; }
        }

        @media (max-width: 560px) {
            .sheet { padding: 1.4rem 1.2rem; }
            .sheet-head { flex-direction: column; }
            .doc-id { text-align: left; }
            .info-grid, .signatures { grid-template-columns: 1fr; }
            .track { flex-direction: column; align-items: flex-start; }
        }
    </style>
</head>
<body>

    <div class="toolbar no-print">
        <span class="toolbar-msg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Comprobante de ingreso — Orden #{{ $order->id }}
        </span>
        <span class="toolbar-actions">
            <button type="button" class="btn btn-primary" onclick="window.print()">Imprimir comprobante</button>
            <a class="btn" href="{{ route('clientes.show', $order->device->customer_id) }}">Ir a la ficha del cliente</a>
            <a class="btn" href="{{ route('ordenes.create') }}">Nueva orden</a>
        </span>
    </div>

    <main class="sheet">

        <header class="sheet-head">
            <div class="brand">
                <img src="/img/ulicel-logo.jpeg" alt="Logo">
                <div>
                    <h1>{{ $settings->name ?: 'Ulicel' }}</h1>
                    @if ($settings->address)
                        <p>{{ $settings->address }}</p>
                    @endif
                    @if ($contactoTaller !== '')
                        <p>{{ $contactoTaller }}</p>
                    @endif
                </div>
            </div>
            <div class="doc-id">
                <span class="doc-kicker">Comprobante de ingreso</span>
                <strong>Orden #{{ $order->id }}</strong>
                <span class="doc-date">{{ $fechaIngreso->format('d/m/Y') }} · {{ $fechaIngreso->format('H:i') }} hs</span>
            </div>
        </header>

        <section class="info-grid">
            <div>
                <p class="block-label">Cliente</p>
                <p class="block-value">{{ $nombreCliente }}</p>
                @if ($cliente->dni)
                    <p class="block-sub">DNI: {{ $cliente->dni }}</p>
                @endif
                @if ($cliente->phone)
                    <p class="block-sub">Tel: {{ $cliente->phone }}</p>
                @endif
                @if ($cliente->email)
                    <p class="block-sub">{{ $cliente->email }}</p>
                @endif
            </div>
            <div>
                <p class="block-label">Equipo</p>
                <p class="block-value">{{ $order->device->brand }} {{ $order->device->model }}</p>
                <p class="block-sub">{{ $order->device->type }}</p>
                @if ($order->device->imei)
                    <p class="block-sub">IMEI: {{ $order->device->imei }}</p>
                @endif
            </div>
        </section>

        <section class="section">
            <p class="block-label">Problema reportado</p>
            <p class="text">{{ $order->reported_problem }}</p>
        </section>

        <section class="section">
            <p class="block-label">Estado al ingreso</p>
            <p class="text">{{ $order->entry_notes ?: 'Sin observaciones registradas.' }}</p>
        </section>

        <section class="section">
            <p class="block-label">Presupuesto de referencia</p>
            <div class="quote-box">
                @if ($order->estimated_price !== null)
                    <span class="q-name">{{ $order->service?->name ?? 'Servicio' }}</span>
                    <span class="q-price">${{ number_format($order->estimated_price, 2, ',', '.') }}</span>
                @else
                    <span class="q-name">A presupuestar tras el diagnóstico técnico</span>
                @endif
            </div>
            <p class="quote-note">El monto es un presupuesto de referencia y puede variar según el diagnóstico técnico definitivo del equipo.</p>
        </section>

        @if ($urlSeguimiento)
            <section class="section">
                <div class="track">
                    <div class="track-qr">
                        {!! QrCode::size(140)->generate($urlSeguimiento) !!}
                    </div>
                    <div>
                        <p class="block-label">Seguimiento de tu reparación</p>
                        <p class="track-code">{{ $order->tracking_code }}</p>
                        <p class="track-text">Escaneá el QR con tu celular para ver el estado de tu equipo en cualquier momento. También podés presentar este comprobante para retirarlo.</p>
                        <p class="track-url">{{ $urlSeguimiento }}</p>
                    </div>
                </div>
            </section>
        @endif

        <section class="signatures">
            <div class="sign-line">Firma del cliente</div>
            <div class="sign-line">Recibido por: {{ $order->receivedBy->name ?? '—' }}</div>
        </section>

        <p class="foot">Comprobante generado por el sistema {{ $settings->name ?: 'Ulicel' }} — {{ now()->timezone('America/Argentina/Salta')->format('d/m/Y H:i') }}</p>

    </main>

</body>
</html>
