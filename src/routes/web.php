<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\RepairOrderController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'create'])->name('login');
    Route::post('/login', [AuthController::class, 'store'])->name('login.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/panel', fn () => view('dashboard'))->name('dashboard');
    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');

    // Pantalla de clientes
    Route::get('/clientes', function () {
        return view('clientes');
    })->name('clientes.index');

    Route::get('/clientes/{customer}', function (\App\Models\Customer $customer) {
        return view('cliente', compact('customer'));
    })->name('clientes.show');

    // API de clientes
    Route::prefix('api/clientes')->group(function () {
        Route::get('/', [CustomerController::class, 'index'])->name('api.clientes.index');
        Route::post('/', [CustomerController::class, 'store'])->name('api.clientes.store');
        Route::get('/{customer}', [CustomerController::class, 'show'])->name('api.clientes.show');
        Route::put('/{customer}', [CustomerController::class, 'update'])->name('api.clientes.update');
        Route::delete('/{customer}', [CustomerController::class, 'destroy'])->name('api.clientes.destroy');
    });

    // API de dispositivos
    Route::prefix('api/clientes/{customer}/dispositivos')->group(function () {
        Route::get('/', [DeviceController::class, 'index'])
            ->name('api.dispositivos.index');

        Route::post('/', [DeviceController::class, 'store'])
            ->name('api.dispositivos.store');

        Route::put('/{device}', [DeviceController::class, 'update'])
            ->name('api.dispositivos.update');

        Route::delete('/{device}', [DeviceController::class, 'destroy'])
            ->name('api.dispositivos.destroy');
    });
    //API De ordenes de reparacion
    Route::prefix('api/clientes/{customer}/ordenes')->group(function () {
    Route::get('/', [RepairOrderController::class, 'index'])
        ->name('api.ordenes.index');

    Route::post('/', [RepairOrderController::class, 'store'])
        ->name('api.ordenes.store');

    Route::put('/{order}', [RepairOrderController::class, 'update'])
    ->name('api.ordenes.update');
   });
});
