<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('repair_order_updates', function (Blueprint $table) {
            $table->id();

            $table->foreignId('repair_order_id')
                ->constrained('repair_orders')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('status', 30);

            $table->text('message');

            $table->timestamps();

            $table->index(['repair_order_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repair_order_updates');
    }
};
