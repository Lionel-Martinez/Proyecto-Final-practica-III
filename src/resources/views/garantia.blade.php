<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Garantía Digital · Ulicel</title>
    <link rel="stylesheet" href="/css/garantia.css">
</head>
<body>

    <main class="wrap">

        <div class="ticket">

            @php
                $vencida = $order->warranty_expires_at && $order->warranty_expires_at->isPast();
            @endphp

            <span class="stamp {{ $vencida ? 'expired' : '' }}">
                {!! $vencida ? 'Garantía<br>Vencida' : 'Garantía<br>Activa' !!}
            </span>

            <div class="ticket-zigzag ticket-zigzag-top" aria-hidden="true"></div>

            <div class="ticket-body">

                <div class="brand-head">
                    <div class="brand-mark">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5z"></path></svg>
                        <span>ULICEL</span>
                    </div>
                    <p class="brand-sub">Servicio Técnico Especializado</p>
                </div>

                <div class="tear-line"></div>

                <p class="ticket-kicker">Certificado de Garantía</p>
                <p class="order-id">{{ $order->warranty_code }}</p>

                <div class="tear-line"></div>

                <div class="row-pair">
                    <div>
                        <p class="row-label">Equipo</p>
                        <p class="row-value">{{ $order->device->brand }} {{ $order->device->model }}</p>
                    </div>
                    <div>
                        <p class="row-label">Reparación</p>
                        <p class="row-value">{{ $order->reported_problem }}</p>
                    </div>
                </div>

                <div class="vence-row">
                    <span class="row-label">Vence el</span>
                    <span class="vence-date">{{ $order->warranty_expires_at?->format('d/m/Y') }}</span>
                </div>

                <div class="tear-line"></div>

                <p class="ticket-kicker">Condiciones</p>
                <ul class="condiciones-list">
                    <li>La garantía cubre únicamente fallos relacionados con la pieza reemplazada y mano de obra.</li>
                    <li>Daños por impacto, contacto con líquidos o manipulación de terceros invalidan este certificado.</li>
                    <li>Es obligatorio presentar este certificado digital o el número de orden para cualquier reclamo.</li>
                    <li>Los sellos de seguridad internos deben permanecer intactos para mantener la validez.</li>
                </ul>

                <div class="tear-line"></div>

                <button type="button" class="details-toggle" id="details-toggle">
                    <span>Ver detalles técnicos</span>
                    <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>

                <div class="details-panel" id="details-panel" hidden>
                    <div class="detail-row">
                        <span>Recibido por</span>
                        <strong>{{ $order->receivedBy->name ?? '—' }}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Cliente</span>
                        <strong>{{ trim($order->device->customer->first_name . ' ' . $order->device->customer->last_name) }}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Taller</span>
                        <strong>Ulicel — Orán, Salta</strong>
                    </div>
                </div>

                <div class="tear-line"></div>

                <a href="#" class="whatsapp-btn" aria-disabled="true">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.5 3.58 1.36 5.08L2 22l5.19-1.44a9.87 9.87 0 0 0 4.85 1.24h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2zm0 18.06h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.86.83-3.03-.2-.31a8.16 8.16 0 0 1-1.26-4.34c0-4.52 3.69-8.2 8.24-8.2 2.2 0 4.27.86 5.82 2.42a8.14 8.14 0 0 1 2.41 5.79c0 4.52-3.69 8.14-8.23 8.14zm4.5-6.13c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.16 1.72 2.62 4.16 3.68.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.46-.6 1.66-1.17.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29z"></path></svg>
                    Reclamos por WhatsApp (próximamente)
                </a>

                <div class="qr-block">
                    {!! QrCode::size(130)->generate(url()->current()) !!}
                    <p class="folio">{{ url()->current() }}</p>
                </div>

                <p class="hours">Atención inmediata · Lu-Vi 09:00-18:00</p>
                <p class="footnote">Certificado autenticado por Ulicel</p>

            </div>

            <div class="ticket-zigzag ticket-zigzag-bottom" aria-hidden="true"></div>

        </div>

    </main>

    <script>
        const toggle = document.getElementById('details-toggle');
        const panel = document.getElementById('details-panel');

        toggle.addEventListener('click', () => {
            const open = toggle.classList.toggle('open');
            panel.hidden = !open;
        });
    </script>

</body>
</html>
