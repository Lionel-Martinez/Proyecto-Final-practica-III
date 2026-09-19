<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #14161a; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #14161a; padding-bottom: 12px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; }
        .header p { margin: 2px 0; color: #6b7280; }
        .code-box { text-align: right; }
        .code-box strong { font-size: 16px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        table td { padding: 8px 0; border-bottom: 1px solid #ececec; }
        .label { color: #6b7280; width: 160px; }
        .total { margin-top: 24px; text-align: right; font-size: 18px; font-weight: bold; }
        .footer { margin-top: 40px; font-size: 10px; color: #9aa0a8; text-align: center; }
    </style>
</head>
<body>

    <div class="header">
        <div>
            <h1>Ulicel</h1>
            <p>Servicio técnico de celulares y notebooks</p>
            <p>Orán, Salta, Argentina</p>
        </div>
        <div class="code-box">
            <p>Comprobante de Pago</p>
            <strong>{{ $transaction->code }}</strong>
            <p>{{ $transaction->created_at->format('d/m/Y H:i') }}</p>
        </div>
    </div>

    <table>
        <tr>
            <td class="label">Cliente</td>
            <td>{{ trim($transaction->customer->first_name . ' ' . $transaction->customer->last_name) }}</td>
        </tr>
        @if ($transaction->customer->dni)
            <tr>
                <td class="label">DNI</td>
                <td>{{ $transaction->customer->dni }}</td>
            </tr>
        @endif
        @if ($transaction->repairOrder)
            <tr>
                <td class="label">Orden de reparación</td>
                <td>#{{ $transaction->repairOrder->id }} — {{ $transaction->repairOrder->device->brand }} {{ $transaction->repairOrder->device->model }}</td>
            </tr>
            <tr>
                <td class="label">Problema reportado</td>
                <td>{{ $transaction->repairOrder->reported_problem }}</td>
            </tr>
        @endif
        <tr>
            <td class="label">Método de pago</td>
            <td>{{ $transaction->method }}</td>
        </tr>
        <tr>
            <td class="label">Registrado por</td>
            <td>{{ $transaction->registeredBy->name }}</td>
        </tr>
    </table>

    <p class="total">Total: ${{ number_format($transaction->amount, 2, ',', '.') }}</p>

    <p class="footer">Este comprobante fue generado electrónicamente por el sistema Ulicel — {{ now()->format('d/m/Y H:i') }}</p>

</body>
</html>

