<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\PartController;
use App\Http\Controllers\RepairOrderController;
use App\Http\Controllers\SupplierController;
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

    // Pantalla de repuestos
    Route::get('/repuestos', function () {
    return view('repuestos');
})->name('repuestos.index');

Route::get('/proveedores', function () {
    return view('proveedores');
})->name('proveedores.index');
    Route::prefix('api/proveedores')->group(function () {
    Route::get('/', [SupplierController::class, 'index'])
        ->name('api.proveedores.index');

    Route::post('/', [SupplierController::class, 'store'])
        ->name('api.proveedores.store');

    Route::get('/{supplier}', [SupplierController::class, 'show'])
        ->name('api.proveedores.show');

    Route::put('/{supplier}', [SupplierController::class, 'update'])
        ->name('api.proveedores.update');

    Route::delete('/{supplier}', [SupplierController::class, 'destroy'])
        ->name('api.proveedores.destroy');
});

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
   // API de repuestos
Route::prefix('api/repuestos')->group(function () {
    Route::get('/', [PartController::class, 'index'])
        ->name('api.repuestos.index');

    Route::post('/', [PartController::class, 'store'])
        ->name('api.repuestos.store');

    Route::get('/{part}', [PartController::class, 'show'])
        ->name('api.repuestos.show');

    Route::put('/{part}', [PartController::class, 'update'])
        ->name('api.repuestos.update');

    Route::delete('/{part}', [PartController::class, 'destroy'])
        ->name('api.repuestos.destroy');
});
});
