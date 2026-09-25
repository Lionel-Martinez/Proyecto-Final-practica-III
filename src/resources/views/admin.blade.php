@extends('layouts.ulicel')

@section('titulo', 'Admin — Ulicel')

@section('content')

    <p class="breadcrumb">
        <a href="{{ route('dashboard') }}">Launcher</a>
        <span>/</span>
        <strong>Admin</strong>
    </p>

    <div class="launcher-head">
        <h1>Configuración</h1>
        <p>Datos del taller y usuarios con acceso al sistema.</p>
    </div>

    @if (session('status'))
        <p style="color:#1a9d4b; font-weight:700; margin-bottom:1rem;">{{ session('status') }}</p>
    @endif

    <div class="admin-grid">

        <section class="admin-card">
            <p class="card-title">Datos del Taller</p>
            <p class="card-subtitle">Aparecen en la garantía digital y en los comprobantes.</p>

            <form method="POST" action="{{ route('admin.settings.update') }}">
                @csrf

                <div class="field">
                    <label for="taller-nombre">Nombre del taller</label>
                    <input type="text" id="taller-nombre" name="name" value="{{ $settings->name }}" placeholder="Ulicel">
                </div>
                <div class="field">
                    <label for="taller-direccion">Dirección</label>
                    <input type="text" id="taller-direccion" name="address" value="{{ $settings->address }}" placeholder="Ej: Orán, Salta">
                </div>
                <div class="field-row">
                    <div class="field">
                        <label for="taller-telefono">Teléfono</label>
                        <input type="text" id="taller-telefono" name="phone" value="{{ $settings->phone }}" placeholder="+54 9 387 ...">
                    </div>
                    <div class="field">
                        <label for="taller-email">Email</label>
                        <input type="text" id="taller-email" name="email" value="{{ $settings->email }}" placeholder="contacto@ulicel.com">
                    </div>
                </div>
                <button type="submit" class="btn-solid">Guardar Datos</button>
            </form>
        </section>

        <section class="admin-card">
            <div class="card-head-row">
                <div>
                    <p class="card-title">Usuarios y Accesos</p>
                    <p class="card-subtitle">Quién puede entrar al sistema y con qué rol.</p>
                </div>
            </div>

            <ul class="user-list" id="user-list" data-store-url="{{ route('api.admin.usuarios.store') }}" data-destroy-base="/api/admin/usuarios">
                @foreach ($users as $u)
                    <li data-user-id="{{ $u->id }}">
                        <span class="user-avatar">{{ strtoupper(substr($u->name, 0, 2)) }}</span>
                        <span class="user-name">
                            {{ $u->name }}
                            <span class="user-username">@{{ $u->username }}</span>
                        </span>
                        <span class="user-rol-pill rol-{{ $u->role }}">{{ ucfirst($u->role) }}</span>
                        @if ($u->id !== auth()->id())
                            <button type="button" class="user-remove" data-id="{{ $u->id }}" aria-label="Quitar usuario">✕</button>
                        @endif
                    </li>
                @endforeach
            </ul>

            <form id="user-form" class="user-form">
                <input type="text" id="user-nombre" placeholder="Nombre del usuario">
                <select id="user-rol">
                    <option value="admin">Admin</option>
                    <option value="tecnico">Técnico</option>
                    <option value="mostrador">Mostrador</option>
                </select>
                <button type="submit" class="btn-solid btn-add-user">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Agregar
                </button>
            </form>
        </section>

        <section class="admin-card admin-card-wide">
            <p class="card-subtitle">Accesos que todavía no están en el launcher principal.</p>
            <div class="admin-links">
                <a href="{{ route('proveedores.index') }}" class="admin-link">
                    <span class="admin-link-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    </span>
                    <span>
                        <strong>Proveedores</strong>
                        <span>Contactos y pedidos de reposición</span>
                    </span>
                    <svg class="admin-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </a>
            </div>
        </section>

    </div>

@endsection

@push('modals')
    <div class="modal-overlay" id="credential-overlay" hidden>
        <div class="modal-dialog">
            <h2>Usuario creado</h2>
            <p>Guardá esta contraseña ahora — no se vuelve a mostrar. Compartísela al empleado de forma segura.</p>
            <div class="credential-box">
                <div>Usuario: <strong id="credential-username"></strong></div>
                <div>Contraseña: <strong id="credential-password"></strong></div>
            </div>
            <button type="button" class="btn-solid" id="credential-close" style="width:100%; justify-content:center;">Entendido</button>
        </div>
    </div>
@endpush

@push('styles')
    <link rel="stylesheet" href="/css/admin.css">
@endpush

@push('scripts')
    <script src="/js/admin.js"></script>
@endpush
