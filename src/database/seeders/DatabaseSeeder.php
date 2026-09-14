<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::updateOrCreate(
            ['username' => 'admin_ulicel'],
            [
                'name' => 'Administrador Ulicel',
                'email' => 'admin@ulicel.local',
                'role' => 'admin',
                'password' => Hash::make('Cambiar123!'),
            ],
        );
    }
}
