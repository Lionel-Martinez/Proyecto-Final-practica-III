<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seguimiento {{ $order->tracking_code }} — Ulicel</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0; font-family: -apple-system, "Segoe UI", Roboto, sans-serif;
            background: #f4f5f6; color: #14161a;
        }
        .wrap { max-width: 28rem; margin: 0 auto; padding: 2rem 1.2rem 3rem; }
        .brand { display: flex; align-items: center; justify-content: center; gap: 0.6rem; margin-bottom: 1.6rem; }
        .brand img { width: 2rem; height: 2rem; border-radius: 0.4rem; }
        .brand span { font-weight: 800; font-size: 1.1rem; }
        .code-chip {
            display: block; text-align: center; font-family: "Courier New", monospace;
            font-size: 0.8rem; color: #9aa0a8; margin-bottom: 1.6rem;
        }
        .card { background: #fff; border: 1px solid #ececec; border-radius: 0.9rem; padding: 1.6rem; margin-bottom: 1rem; }
        .card h1 { margin: 0 0 0.2rem; font-size: 1.15rem; font-weight: 800; }
        .card p.sub { margin: 0 0 1.4rem; font-size: 0.85rem; color: #6b7280; }

        .steps { display: flex; flex-direction: column; gap: 0; }
        .step { display: flex; gap: 0.8rem; position: relative; padding-bottom: 1.6rem; }
        .step:last-child { padding-bottom: 0; }
        .step-dot {
            width: 1.6rem; height: 1.6rem; border-radius: 50%; background: #ececec; color: #9aa0a8;
            display: flex; align-items: center; justify-content: center; flex-shrink: 0; z-index: 1;
        }
        .step.done .step-dot { background: #1a9d4b; color: #fff; }
        .step.current .step-dot { background: #14161a; color: #fff; }
        .step:not(:last-child)::before {
            content: ""; position: absolute; left: 0.8rem; top: 1.6rem; bottom: 0;
            width: 2px; background: #ececec;
        }
        .step.done:not(:last-child)::before { background: #1a9d4b; }
        .step-text strong { display: block; font-size: 0.9rem; }
        .step-text span { font-size: 0.78rem; color: #9aa0a8; }

        .info-list { list-style: none; margin: 0; padding: 0; }
        .info-list li { display: flex; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px solid #f2f3f5; font-size: 0.85rem; }
        .info-list li:last-child { border-bottom: none; }
        .info-list span:first-child { color: #8b8f97; }
        .info-list span:last-child { font-weight: 700; text-align: right; }

        .refresh-hint { text-align: center; font-size: 0.76rem; color: #9aa0a8; margin-top: 1rem; }
        .warranty { background: #eef8f0; border: 1px solid #cdeed6; color: #1a7d3c; border-radius: 0.7rem; padding: 1rem 1.2rem; font-size: 0.85rem; }
    </style>
</head>
<body>

    <div class="wrap">

        <div class="brand">
            <img src="/img/ulicel-logo.jpeg" alt="Ulicel">
            <span>Ulicel</span>
        </div>

        <span class="code-chip">Seguimiento — {{ $order->tracking_code }}</span>

        <div class="card">
            <h1>Hola, {{ $order->device->customer->first_name }}</h1>
            <p class="sub">{{ $order->device->brand }} {{ $order->device->model }} — {{ $order->reported_problem }}</p>

            @php
                $pasos = [
                    'recibido' => ['label' => 'Recibido', 'desc' => 'Tu equipo ingresó al taller'],
                    'en_reparacion' => ['label' => 'En reparación', 'desc' => 'Nuestro técnico está trabajando en él'],
                    'listo' => ['label' => 'Listo', 'desc' => 'Reparación terminada, esperando retiro'],
                    'entregado' => ['label' => 'Entregado', 'desc' => 'Ya retiraste tu equipo'],
                ];
                $orden = array_keys($pasos);
                $actual = in_array($order->status, $orden) ? array_search($order->status, $orden) : 0;
            @endphp

            <div class="steps">
                @foreach ($pasos as $key => $paso)
                    @php $index = array_search($key, $orden); @endphp
                    <div class="step {{ $index < $actual ? 'done' : ($index === $actual ? 'current' : '') }}">
                        <div class="step-dot">
                            @if ($index < $actual)
                                ✓
                            @else
                                {{ $index + 1 }}
                            @endif
                        </div>
                        <div class="step-text">
                            <strong>{{ $paso['label'] }}</strong>
                            <span>{{ $paso['desc'] }}</span>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>

        <div class="card">
            <ul class="info-list">
                <li><span>Ingreso</span><span>{{ $order->received_at?->format('d/m/Y H:i') }}</span></li>
                <li><span>Prioridad</span><span>{{ ucfirst($order->priority) }}</span></li>
                @if ($order->status === 'entregado' && $order->warranty_code)
                    <li><span>Garantía</span><span>{{ $order->warranty_code }}</span></li>
                @endif
            </ul>
        </div>

        @if ($order->status === 'entregado')
            <div class="warranty">Tu equipo ya fue entregado. ¡Gracias por confiar en Ulicel!</div>
        @endif

        <p class="refresh-hint">Volvé a abrir este link cuando quieras para ver el estado actualizado.</p>

    </div>

</body>
</html>
