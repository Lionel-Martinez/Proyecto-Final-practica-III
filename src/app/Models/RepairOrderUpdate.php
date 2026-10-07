<?php

namespace App\Models;

use App\Models\RepairOrder;
use App\Models\User;
use App\Notifications\RepairOrderUpdated;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RepairOrderUpdate extends Model
{
    use HasFactory;

    protected $fillable = [
        'repair_order_id',
        'user_id',
        'status',
        'message',
    ];

    protected static function booted(): void
    {
        static::created(function (RepairOrderUpdate $update) {
            $update->loadMissing('repairOrder.device.customer');

            $customer = $update->repairOrder?->device?->customer;

            if (!$customer || blank($customer->email)) {
                return;
            }

            $customer->notify(new RepairOrderUpdated($update));
        });
    }

    public function repairOrder(): BelongsTo
    {
        return $this->belongsTo(RepairOrder::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
