<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('repair_orders', function (Blueprint $table) {
            $table->foreignId('service_id')->nullable()->after('device_id')->constrained('services')->nullOnDelete();
            $table->decimal('estimated_price', 10, 2)->nullable()->after('service_id');
        });
    }

    public function down(): void
    {
        Schema::table('repair_orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('service_id');
            $table->dropColumn('estimated_price');
        });
    }
};
