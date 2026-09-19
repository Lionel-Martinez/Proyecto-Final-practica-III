<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #14161a; }
        .header { border-bottom: 2px solid #14161a; padding-bottom: 12px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; }
        .header p { margin: 2px 0; color: #6b7280; }
        h2 { font-size: 14px; margin-top: 24px; border-bottom: 1px solid #ececec; padding-bottom: 6px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table th, table td { padding: 6px 8px; border-bottom: 1px solid #ececec; text-align: left; }
        table th { color: #6b7280; font-size: 10px; text-transform: uppercase; }
        .num { text-align: right; }
        .kpi-row { margin-top: 10px; }
        .kpi { display: inline-block; border: 1px solid #ececec; border-radius: 6px; padding: 10px 14px; margin-right: 10px; }
        .kpi span { display: block; font-size: 10px; color: #6b7280; text-transform: uppercase; }
        .kpi strong { font-size: 16px; }
        .footer { margin-top: 30px; font-size: 10px; color: #9aa0a8; text-align: center; }
    </style>
</head>
<body>

    <div class="header">
        <h1>Ulicel — Reporte de Rentabilidad</h1>
        <p>Período: {{ $periodoLabel }}</p>
    </div>

    <div class="kpi-row">
        <div class="kpi"><span>Ingresos</span><strong>${{ number_format($ingresos, 2, ',', '.') }}</strong></div>
        <div class="kpi"><span>Trabajos de Hoy</span><strong>{{ $trabajosHoy }}</strong></div>
        <div class="kpi"><span>Cobro Promedio</span><strong>${{ number_format($costoPromedio, 2, ',', '.') }}</strong></div>
    </div>

    <p style="color:#b45309; font-size: 10px; margin-top: 14px;">Nota: Costos y Ganancia Real no se incluyen en este reporte — requieren registrar qué repuestos se usan en cada orden, funcionalidad aún no implementada.</p>

    <h2>Equipos más reparados</h2>
    <table>
        <tr><th>Equipo</th><th class="num">Órdenes</th></tr>
        @forelse ($ranking as $item)
            <tr><td>{{ $item['nombre'] }}</td><td class="num">{{ $item['tickets'] }}</td></tr>
        @empty
            <tr><td colspan="2">Sin datos en este período.</td></tr>
        @endforelse
    </table>

    <h2>Top Cobros del Período</h2>
    <table>
        <tr><th>Código</th><th>Cliente</th><th>Equipo</th><th class="num">Monto</th></tr>
        @forelse ($topOrdenes as $t)
            <tr>
                <td>{{ $t['codigo'] }}</td>
                <td>{{ $t['cliente'] }}</td>
                <td>{{ $t['equipo'] }}</td>
                <td class="num">${{ number_format($t['monto'], 2, ',', '.') }}</td>
            </tr>
        @empty
            <tr><td colspan="4">Sin cobros en este período.</td></tr>
        @endforelse
    </table>

    <p class="footer">Generado electrónicamente por Ulicel — {{ now()->format('d/m/Y H:i') }}</p>

</body>
</html>
