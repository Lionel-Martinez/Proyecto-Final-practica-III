<?php

namespace App\Notifications;

use App\Models\RepairOrderUpdate;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RepairOrderUpdated extends Notification
{
    public function __construct(
        public RepairOrderUpdate $update
    ) {
    }

    /**
     * Canales de entrega.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Contenido del email.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $order = $this->update->repairOrder;

        return (new MailMessage)
            ->subject('Actualización de tu orden ' . $order->tracking_code)
            ->greeting('Hola, ' . $notifiable->first_name)
            ->line($this->update->message)
            ->line('Estado actual: ' . ucfirst(str_replace('_', ' ', $this->update->status)))
            ->action(
                'Ver seguimiento',
                route('ordenes.seguimiento', $order->tracking_code)
            )
            ->line('Podés consultar el estado de tu equipo desde el enlace de seguimiento.');
    }

    /**
     * Representación para otros canales.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'repair_order_id' => $this->update->repair_order_id,
            'status' => $this->update->status,
            'message' => $this->update->message,
        ];
    }
}
