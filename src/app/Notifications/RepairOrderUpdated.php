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
        ->subject('Ulicel — Actualización de tu orden ' . $order->tracking_code)
        ->view('emails.repair-order-updated', [
            'notifiable' => $notifiable,
            'update' => $this->update,
            'order' => $order,
        ]);
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
