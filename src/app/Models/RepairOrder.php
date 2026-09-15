<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RepairOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'device_id',
        'received_by',
        'received_at',
        'reported_problem',
        'technical_diagnosis',
        'status',
        'priority',
        'entry_photo_path',
        'exit_photo_path',
        'warranty_code',
        'warranty_expires_at',
        'entry_notes',
    ];

    protected $casts = [
        'received_at' => 'datetime',
        'warranty_expires_at' => 'date',
    ];

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    public function receivedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'received_by');
    }
}
