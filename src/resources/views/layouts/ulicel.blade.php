<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="ulicel-user-role" content="{{ auth()->user()->role }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('titulo', 'Ulicel')</title>

    <link rel="stylesheet" href="/css/menu principal.css">
    @stack('styles')
</head>
<body>

<header>
    <div class="izquierda">
        <div class="menu-container">
            <div class="menu" id="menu">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        <div class="brand">
            <img src="/img/ulicel-logo.jpeg" alt="Ulicel Logo" class="logo">
            <span class="name">Ulicel</span>
        </div>
    </div>

    <div class="derecha">
        <a href="#" class="icons-header" aria-label="Buscar">
            <img src="/img/menu principal/search.svg" alt="buscar">
        </a>
        <a href="#" class="icons-header" aria-label="Ayuda">
            <img src="/img/menu principal/question.svg" alt="ayuda">
        </a>
        <a href="#" class="icons-header" aria-label="Notificaciones">
            <img src="/img/menu principal/notification.svg" alt="notificaciones">
            <span class="notif-dot" id="notif-dot" hidden></span>
        </a>
        <div class="user-block">
            <img src="/img/ulicel-logo.jpeg" alt="img-user" class="user">
            <span class="role-badge" id="role-badge">{{ ucfirst(auth()->user()->role) }}</span>
        </div>
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="icons-header" aria-label="Cerrar sesión">Salir</button>
        </form>
    </div>
</header>

@unless ($noSidebar ?? false)
<div class="sidebar" id="sidebar">
    <nav>
        <ul>
            <li data-roles="admin,tecnico,mostrador">
                <a href="{{ route('dashboard') }}" class="{{ request()->routeIs('dashboard') ? 'selected' : '' }}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect></svg>
                    <span>Launcher</span>
                </a>
            </li>
            <li data-roles="admin,mostrador">
                <a href="{{ route('clientes.index') }}" class="{{ request()->routeIs('clientes.*') ? 'selected' : '' }}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span>Clientes</span>
                </a>
            </li>
                        <li data-roles="admin,tecnico,mostrador">
                <a href="{{ route('ordenes.create') }}" class="{{ request()->routeIs('ordenes.create') || request()->routeIs('ordenes.confirmacion') ? 'selected' : '' }}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 1 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 1 1 5.4-5.4z"></path></svg>
                    <span>Nueva Orden</span>
                </a>
            </li>
            <li data-roles="admin,tecnico,mostrador">
                <a href="{{ route('ordenes-activas.index') }}" class="{{ request()->routeIs('ordenes-activas.*') ? 'selected' : '' }}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 8-8"></path><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"></path></svg>
                    <span>Órdenes Activas</span>
                </a>
            </li>
            <li data-roles="admin,tecnico">
                <a href="{{ route('work-queue.index') }}" class="{{ request()->routeIs('work-queue.*') ? 'selected' : '' }}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                    <span>Work Queue</span>
                </a>
            </li>
            <li data-roles="admin,tecnico">
                <a href="{{ route('repuestos.index') }}" class="{{ request()->routeIs('repuestos.*') ? 'selected' : '' }}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="1"></rect><path d="M3 8 5 3h14l2 5"></path><line x1="10" y1="12" x2="14" y2="12"></line></svg>
                    <span>Inventory</span>
                </a>
            </li>
            <li data-roles="admin,mostrador">
                <a href="{{ route('proveedores.index') }}" class="{{ request()->routeIs('proveedores.*') ? 'selected' : '' }}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                    <span>Proveedores</span>
                                </a>
            </li>
            <li data-roles="admin,mostrador">
                <a href="{{ route('caja.index') }}" class="{{ request()->routeIs('caja.*') ? 'selected' : '' }}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="3"></circle></svg>
                    <span>Caja/Factura</span>
                </a>
            </li>
            <li data-roles="admin">
                <a href="{{ route('analytics.index') }}" class="{{ request()->routeIs('analytics.*') ? 'selected' : '' }}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="21" x2="5" y2="12"></line><line x1="12" y1="21" x2="12" y2="7"></line><line x1="19" y1="21" x2="19" y2="15"></line></svg>
                    <span>Analytics</span>
                </a>
            </li>
        </ul>
    </nav>

    <div class="sidebar-foot">
        <a href="{{ route('ordenes.create') }}" class="new-repair-btn" data-roles="admin,tecnico,mostrador">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            New Repair
        </a>
        <a href="#" class="foot-link" data-roles="admin">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 3.9l.06.06A1.65 1.65 0 0 0 8.92 4.3H9a1.65 1.65 0 0 0 1-1.51V2.7a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span>Settings</span>
        </a>
        <a href="#" class="foot-link" data-roles="admin,tecnico,mostrador">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <span>Support</span>
        </a>
    </div>
</div>
@endunless

<main id="main" class="{{ ($noSidebar ?? false) ? 'main-full' : '' }}">
    @yield('content')
</main>

@stack('modals')

<script src="/js/menu principal.js"></script>
@stack('scripts')
</body>
</html>
