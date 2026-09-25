<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\PartController;
use App\Http\Controllers\RepairOrderController;
use App\Http\Controllers\RepairOrderWizardController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WorkQueueController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'create'])->name('login');
    Route::post('/login', [AuthController::class, 'store'])->name('login.store');
});

Route::middleware('auth')->group(function () {

    Route::get('/panel', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');

    // Pantalla de repuestos
    Route::get('/repuestos', function () {
        return view('repuestos');
    })->name('repuestos.index');

    Route::get('/proveedores', function () {
        return view('proveedores');
    })->name('proveedores.index');

    Route::prefix('api/proveedores')->group(function () {
        Route::get('/', [SupplierController::class, 'index'])->name('api.proveedores.index');
        Route::post('/', [SupplierController::class, 'store'])->name('api.proveedores.store');
        Route::get('/{supplier}', [SupplierController::class, 'show'])->name('api.proveedores.show');
        Route::put('/{supplier}', [SupplierController::class, 'update'])->name('api.proveedores.update');
        Route::delete('/{supplier}', [SupplierController::class, 'destroy'])->name('api.proveedores.destroy');
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
        Route::get('/', [DeviceController::class, 'index'])->name('api.dispositivos.index');
        Route::post('/', [DeviceController::class, 'store'])->name('api.dispositivos.store');
        Route::put('/{device}', [DeviceController::class, 'update'])->name('api.dispositivos.update');
        Route::delete('/{device}', [DeviceController::class, 'destroy'])->name('api.dispositivos.destroy');
    });

    // API de ordenes de reparacion (dentro de la ficha del cliente)
    Route::prefix('api/clientes/{customer}/ordenes')->group(function () {
        Route::get('/', [RepairOrderController::class, 'index'])->name('api.ordenes.index');
        Route::post('/', [RepairOrderController::class, 'store'])->name('api.ordenes.store');
        Route::put('/{order}', [RepairOrderController::class, 'update'])->name('api.ordenes.update');
    });

    // API de repuestos
    Route::prefix('api/repuestos')->group(function () {
        Route::get('/', [PartController::class, 'index'])->name('api.repuestos.index');
        Route::post('/', [PartController::class, 'store'])->name('api.repuestos.store');
        Route::get('/{part}', [PartController::class, 'show'])->name('api.repuestos.show');
        Route::put('/{part}', [PartController::class, 'update'])->name('api.repuestos.update');
        Route::delete('/{part}', [PartController::class, 'destroy'])->name('api.repuestos.destroy');
    });

    // Asistente de nueva orden de reparación
    Route::get('/nueva-orden', [RepairOrderWizardController::class, 'create'])->name('ordenes.create');
    Route::post('/nueva-orden', [RepairOrderWizardController::class, 'store'])->name('ordenes.store');
    Route::get('/api/ordenes/buscar-cliente', [RepairOrderWizardController::class, 'buscarCliente'])->name('api.ordenes.buscarCliente');
    Route::get('/nueva-orden/{order}/confirmacion', [RepairOrderWizardController::class, 'confirmacion'])->name('ordenes.confirmacion');

    // Work Queue (cola de prioridad)
    Route::get('/work-queue', [WorkQueueController::class, 'view'])->name('work-queue.index');
    Route::get('/api/work-queue', [WorkQueueController::class, 'index'])->name('api.work-queue.index');
    Route::put('/api/work-queue/{order}/iniciar', [WorkQueueController::class, 'iniciar'])->name('api.work-queue.iniciar');
    Route::put('/api/work-queue/{order}/listo', [WorkQueueController::class, 'listo'])->name('api.work-queue.listo');
    Route::post('/api/work-queue/{order}/entregar', [WorkQueueController::class, 'entregar'])->name('api.work-queue.entregar');
    Route::post('/api/work-queue/{order}/cancelar', [WorkQueueController::class, 'cancelar'])->name('api.work-queue.cancelar');

    // Órdenes Activas
    Route::get('/ordenes-activas', [\App\Http\Controllers\ActiveOrdersController::class, 'view'])->name('ordenes-activas.index');
    Route::get('/api/ordenes-activas', [\App\Http\Controllers\ActiveOrdersController::class, 'index'])->name('api.ordenes-activas.index');

    // Rentabilidad
    Route::get('/analytics', [\App\Http\Controllers\AnalyticsController::class, 'index'])->name('analytics.index');
    Route::get('/analytics/pdf', [\App\Http\Controllers\AnalyticsController::class, 'pdf'])->name('analytics.pdf');

    // Buscar
    Route::get('/buscar', [\App\Http\Controllers\SearchController::class, 'view'])->name('buscar.index');
    Route::get('/api/buscar', [\App\Http\Controllers\SearchController::class, 'index'])->name('api.buscar.index');

    // Admin
    Route::get('/admin', [\App\Http\Controllers\AdminController::class, 'index'])->name('admin.index');
    Route::post('/admin/taller', [\App\Http\Controllers\AdminController::class, 'updateSettings'])->name('admin.settings.update');
    Route::post('/api/admin/usuarios', [\App\Http\Controllers\AdminController::class, 'storeUser'])->name('api.admin.usuarios.store');
    Route::delete('/api/admin/usuarios/{user}', [\App\Http\Controllers\AdminController::class, 'destroyUser'])->name('api.admin.usuarios.destroy');

    // Facturación
    Route::get('/caja-factura', [TransactionController::class, 'view'])->name('caja.index');
    Route::get('/api/transacciones', [TransactionController::class, 'index'])->name('api.transacciones.index');
    Route::post('/api/transacciones', [TransactionController::class, 'store'])->name('api.transacciones.store');
    Route::get('/api/transacciones/{transaction}/pdf', [TransactionController::class, 'download'])->name('api.transacciones.pdf');

});

Route::get('/seguimiento/{trackingCode}', [\App\Http\Controllers\RepairOrderWizardController::class, 'seguimiento'])->name('ordenes.seguimiento');

Route::get('/garantia/{warrantyCode}', [\App\Http\Controllers\WarrantyController::class, 'show'])->name('garantia.show');
