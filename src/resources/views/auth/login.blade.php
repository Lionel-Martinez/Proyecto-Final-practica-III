@extends('layouts.app')

@section('titulo', 'Iniciar Sesión')

@section('contenido')
    <div class="row justify-content-center">
        <div class="col-md-4">
            <h2 class="mb-4">Iniciar Sesión</h2>
            <form method="POST" action="/login">
                @csrf
                <div class="mb-3">
                    <label>Usuario</label>
                    <input type="text" name="usuario" class="form-control">
                </div>
                <div class="mb-3">
                    <label>Contraseña</label>
                    <input type="password" name="password" class="form-control">
                </div>
                <button type="submit" class="btn btn-primary w-100">Ingresar</button>
            </form>
        </div>
    </div>
@endsection
