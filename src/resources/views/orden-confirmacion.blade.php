@extends('layouts.ulicel')

@section('titulo', 'Orden registrada — Ulicel')

@section('content')

    <div class="confirm-wrap">

        <div class="confirm-check">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>

        <h1>Orden #{{ $order->id }} registrada</h1>
        <p class="confirm-sub">Pasále este código al cliente para que siga el estado de su reparación.</p>

        <div class="confirm-card">
            <div class="confirm-qr">
                {!! QrCode::size(180)->generate(route('ordenes.seguimiento', $order->tracking_code)) !!}
            </div>
            <p class="confirm-code">{{ $order->tracking_code }}</p>
            <p class="confirm-url">{{ route('ordenes.seguimiento', $order->tracking_code) }}</p>
        </div>

        <div class="confirm-summary">
            <p><strong>Cliente:</strong> {{ trim($order->device->customer->first_name . ' ' . $order->device->customer->last_name) }}</p>
            <p><strong>Equipo:</strong> {{ $order->device->brand }} {{ $order->device->model }}</p>
            <p><strong>Problema:</strong> {{ $order->reported_problem }}</p>
        </div>

        <div class="confirm-actions">
            <button type="button" class="btn-ghost" onclick="window.print()">Imprimir comprobante</button>
            <a href="{{ route('clientes.show', $order->device->customer_id) }}" class="btn-solid">Ir a la ficha del cliente</a>
        </div>

    </div>

@endsection

@push('styles')
    <style>
        .confirm-wrap { max-width: 30rem; margin: 2rem auto; text-align: center; }
        .confirm-check { width: 4rem; height: 4rem; margin: 0 auto 1rem; border-radius: 50%; background: #eef8f0; color: #1a9d4b; display: flex; align-items: center; justify-content: center; }
        .confirm-check svg { width: 2rem; height: 2rem; }
        .confirm-wrap h1 { margin: 0 0 0.4rem; font-size: 1.4rem; font-weight: 800; }
        .confirm-sub { margin: 0 0 1.6rem; color: #6b7280; font-size: 0.9rem; }
        .confirm-card { background: #fff; border: 1px solid #ececec; border-radius: 0.9rem; padding: 1.8rem; margin-bottom: 1.4rem; }
        .confirm-qr { display: flex; justify-content: center; margin-bottom: 1rem; }
        .confirm-code { margin: 0 0 0.2rem; font-family: "Courier New", monospace; font-size: 1.3rem; font-weight: 800; letter-spacing: 0.05em; }
        .confirm-url { margin: 0; font-size: 0.78rem; color: #9aa0a8; word-break: break-all; }
        .confirm-summary { text-align: left; background: #f9fafb; border: 1px solid #ececec; border-radius: 0.7rem; padding: 1.1rem 1.3rem; margin-bottom: 1.6rem; }
        .confirm-summary p { margin: 0.3rem 0; font-size: 0.88rem; }
        .confirm-actions { display: flex; gap: 0.8rem; justify-content: center; }
        .btn-ghost { height: 2.8rem; padding: 0 1.3rem; border: 1px solid #d7dce2; border-radius: 0.5rem; background: #fff; color: #14161a; font-weight: 700; cursor: pointer; }
        .btn-solid { display: inline-flex; align-items: center; height: 2.8rem; padding: 0 1.3rem; border: none; border-radius: 0.5rem; background: #14161a; color: #fff; font-weight: 700; text-decoration: none; }
        .btn-solid:hover { background: #b80f22; }
        @media print { .breadcrumb, .launcher-head, header, .sidebar, .confirm-actions { display: none !important; } }
    </style>
@endpush
