<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
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

    // API de clientes
    Route::prefix('api/clientes')->group(function () {
        Route::get('/', [CustomerController::class, 'index'])->name('api.clientes.index');
        Route::post('/', [CustomerController::class, 'store'])->name('api.clientes.store');
        Route::get('/{customer}', [CustomerController::class, 'show'])->name('api.clientes.show');
        Route::put('/{customer}', [CustomerController::class, 'update'])->name('api.clientes.update');
        Route::delete('/{customer}', [CustomerController::class, 'destroy'])->name('api.clientes.destroy');
    });
});
