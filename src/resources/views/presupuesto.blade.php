<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presupuesto — Ulicel</title>
    <link rel="stylesheet" href="/css/presupuesto.css">
</head>
<body>

    <main class="wrap">

        <div class="card" id="card">

            <div class="card-head">
                <div class="brand-mark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 1 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 1 1 5.4-5.4z"></path></svg>
                    <span>{{ $settings->name ?: 'Ulicel' }}</span>
                </div>
                <p class="taller-sub">{{ $settings->address ?: 'Servicio Técnico Especializado' }}</p>
            </div>

            <div class="doc-title-row">
                <p class="doc-title">Presupuesto</p>
                <span class="doc-folio" id="doc-folio">—</span>
            </div>

            <div class="rule"></div>

            <div class="row-pair">
                <div>
                    <p class="row-label">Cliente</p>
                    <p class="row-value" id="p-cliente">—</p>
                </div>
                <div>
                    <p class="row-label">Fecha</p>
                    <p class="row-value" id="p-fecha">—</p>
                </div>
            </div>

            <div class="rule"></div>

            <table class="items-table">
                <thead>
                    <tr>
                        <th>Servicio</th>
                        <th class="num">Precio</th>
                    </tr>
                </thead>
                <tbody id="items-body"></tbody>
                <tfoot>
                    <tr class="total-row">
                        <td>Total</td>
                        <td class="num" id="p-total">$0,00</td>
                    </tr>
                </tfoot>
            </table>

            <p class="nota">Presupuesto de referencia, válido por 7 días. El valor final puede variar según el diagnóstico técnico definitivo del equipo.</p>

            <div class="actions no-print">
                <button type="button" class="btn-ghost" id="btn-imprimir">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    Imprimir
                </button>
                <a href="#" class="btn-whatsapp" id="btn-whatsapp" target="_blank" rel="noopener">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.5 3.58 1.36 5.08L2 22l5.19-1.44a9.87 9.87 0 0 0 4.85 1.24h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2z"></path></svg>
                    Enviar por WhatsApp
                </a>
            </div>

            <p class="footnote no-print"><a href="{{ route('catalogo.index') }}">← Volver a Lista de Precios</a></p>

        </div>

    </main>

    <script src="/js/presupuesto.js"></script>
</body>
</html>
