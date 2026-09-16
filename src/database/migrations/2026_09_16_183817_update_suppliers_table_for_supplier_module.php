<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->string('contact_name', 100)
                ->nullable()
                ->after('name');

            $table->string('phone', 30)
                ->nullable()
                ->after('contact_name');

            $table->string('address', 150)
                ->nullable()
                ->after('email');

            $table->dropColumn([
                'part_category',
                'whatsapp',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->string('part_category', 100)
                ->nullable();

            $table->string('whatsapp', 30)
                ->nullable();

            $table->dropColumn([
                'contact_name',
                'phone',
                'address',
            ]);
        });
    }
};
