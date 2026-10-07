<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Actualización de tu orden {{ $order->tracking_code }}</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, Helvetica, sans-serif; color: #1f2937;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f6f8; padding: 30px 15px;">
        <tr>
            <td align="center">

                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">

                    <!-- Encabezado -->
                    <tr>
                        <td style="background-color: #111827; padding: 28px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px;">
                                Ulicel
                            </h1>

                            <p style="margin: 8px 0 0; color: #d1d5db; font-size: 14px;">
                                Servicio técnico
                            </p>
                        </td>
                    </tr>

                    <!-- Contenido -->
                    <tr>
                        <td style="padding: 35px 30px;">

                            <p style="margin: 0 0 20px; font-size: 17px;">
                                Hola, {{ $notifiable->first_name }}.
                            </p>

                            <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.6;">
                                Tenemos una actualización sobre tu equipo.
                            </p>

                            <!-- Estado -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 25px; background-color: #f3f4f6; border-radius: 8px;">
                                <tr>
                                    <td style="padding: 20px;">

                                        <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">
                                            ORDEN
                                        </p>

                                        <p style="margin: 0 0 18px; font-size: 18px; font-weight: bold;">
                                            {{ $order->tracking_code }}
                                        </p>

                                        <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">
                                            ESTADO ACTUAL
                                        </p>

                                        <p style="margin: 0; font-size: 18px; font-weight: bold;">
                                            {{ ucfirst(str_replace('_', ' ', $update->status)) }}
                                        </p>

                                    </td>
                                </tr>
                            </table>

                            <!-- Mensaje -->
                            <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.6;">
                                {{ $update->message }}
                            </p>

                            <!-- Botón -->
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 30px;">
                                <tr>
                                    <td align="center" style="border-radius: 8px; background-color: #111827;">
                                        <a href="{{ route('ordenes.seguimiento', $order->tracking_code) }}"
                                           style="display: inline-block; padding: 13px 24px; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: bold;">
                                            Ver seguimiento
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                                También podés consultar el estado de tu equipo utilizando el código de seguimiento de tu orden.
                            </p>

                        </td>
                    </tr>

                    <!-- Pie -->
                    <tr>
                        <td style="padding: 22px 30px; background-color: #f9fafb; text-align: center;">

                            <p style="margin: 0 0 6px; font-size: 14px; font-weight: bold;">
                                Ulicel
                            </p>

                            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                Este es un mensaje automático. Por favor, no respondas a este correo.
                            </p>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
