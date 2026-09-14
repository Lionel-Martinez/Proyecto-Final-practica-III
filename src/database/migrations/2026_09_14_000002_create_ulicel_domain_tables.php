<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('dni', 15)->unique()->nullable();
            $table->string('first_name', 50);
            $table->string('last_name', 60);
            $table->string('phone', 20)->nullable();
            $table->string('email')->nullable();
            $table->string('address', 150)->nullable();
            $table->decimal('outstanding_balance', 12, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->string('type', 30);
            $table->string('brand', 50);
            $table->string('model', 80);
            $table->string('imei', 30)->nullable()->unique();
            $table->timestamps();
        });

        Schema::create('repair_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained()->restrictOnDelete();
            $table->foreignId('received_by')->constrained('users')->restrictOnDelete();
            $table->timestamp('received_at')->useCurrent();
            $table->text('reported_problem');
            $table->text('technical_diagnosis')->nullable();
            $table->enum('status', ['recibido', 'en_reparacion', 'listo', 'entregado', 'cancelado'])->default('recibido');
            $table->enum('priority', ['baja', 'normal', 'urgente'])->default('normal');
            $table->string('entry_photo_path')->nullable();
            $table->string('exit_photo_path')->nullable();
            $table->string('warranty_code', 50)->unique()->nullable();
            $table->date('warranty_expires_at')->nullable();
            $table->text('entry_notes')->nullable();
            $table->timestamps();
        });

        Schema::create('parts', function (Blueprint $table) {
            $table->id();
            $table->string('sku', 50)->unique();
            $table->string('name', 100);
            $table->unsignedInteger('current_stock')->default(0);
            $table->unsignedInteger('minimum_stock')->default(0);
            $table->decimal('cost_price', 12, 2)->default(0);
            $table->decimal('sale_price', 12, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('order_part', function (Blueprint $table) {
            $table->id();
            $table->foreignId('repair_order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('part_id')->constrained()->restrictOnDelete();
            $table->unsignedInteger('quantity_used');
            $table->decimal('applied_unit_price', 12, 2);
            $table->timestamps();
            $table->unique(['repair_order_id', 'part_id']);
        });

        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('part_category', 100)->nullable();
            $table->string('whatsapp', 30)->nullable();
            $table->string('email')->nullable();
            $table->timestamps();
        });

        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('category', 100)->nullable();
            $table->decimal('reference_price', 12, 2);
            $table->timestamps();
        });

        Schema::create('cash_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('repair_order_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('registered_by')->constrained('users')->restrictOnDelete();
            $table->decimal('amount', 12, 2);
            $table->enum('payment_method', ['efectivo', 'transferencia', 'tarjeta', 'mercado_pago', 'otro']);
            $table->timestamp('transacted_at')->useCurrent();
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_transactions');
        Schema::dropIfExists('services');
        Schema::dropIfExists('suppliers');
        Schema::dropIfExists('order_part');
        Schema::dropIfExists('parts');
        Schema::dropIfExists('repair_orders');
        Schema::dropIfExists('devices');
        Schema::dropIfExists('customers');
    }
};
