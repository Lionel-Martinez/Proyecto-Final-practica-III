<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="ulicel-user-role" content="{{ auth()->user()->role }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Clientes — Ulicel</title>

    <link rel="stylesheet" href="/css/menu principal.css">
    <link rel="stylesheet" href="/css/Clientes.css">
</head>
<body>

<header>
    <div class="izquierda">
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
            <span class="role-badge" id="role-badge">
                {{ ucfirst(auth()->user()->role) }}
            </span>
        </div>

        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="icons-header" aria-label="Cerrar sesión">
                Salir
            </button>
        </form>
    </div>
</header>

<main id="main" class="main-full">

    <div class="launcher-layout">

        <div class="launcher-main">

            <div class="launcher-head">
                <p class="launcher-eyebrow">Gestión CRM</p>
                <h1>Clientes</h1>
                <p>Administrá clientes, datos de contacto y saldos pendientes.</p>
            </div>

            <div class="inv-toolbar">

                <div class="inv-search">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="7"></circle>
                        <line x1="16.5" y1="16.5" x2="21" y2="21"></line>
                    </svg>

                    <input
                        type="text"
                        id="search-input"
                        placeholder="Buscar por nombre, DNI o teléfono"
                        autocomplete="off"
                    >
                </div>

                <div class="status-toggle" id="saldo-toggle">
                    <button type="button" class="status-chip active" data-filtro="todos">
                        Todos
                    </button>
                    <button type="button" class="status-chip" data-filtro="saldo">
                        Con saldo
                    </button>
                </div>

                <button type="button" class="btn-solid" id="btn-nuevo-cliente">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="2" stroke-linecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Nuevo cliente
                </button>

            </div>

            <div class="saldo-banner" id="saldo-banner" hidden>
                <div class="saldo-banner-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="9"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="9" y1="12" x2="15" y2="12"></line>
                    </svg>
                </div>

                <div>
                    <strong id="saldo-banner-title"></strong>
                    <p id="saldo-banner-text"></p>
                </div>
            </div>

            <div class="client-grid" id="client-grid"></div>

        </div>

    </div>

</main>

<div class="modal-overlay" id="client-overlay" hidden>
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="client-modal-title">

        <div class="modal-head">
            <h2 id="client-modal-title">Nuevo Cliente</h2>

            <button type="button" class="modal-close" id="client-modal-close" aria-label="Cerrar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round">
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                </svg>
            </button>
        </div>

        <form id="client-form">
            <div class="modal-body">

                <input type="hidden" id="client-id">

                <div class="field">
                    <label for="client-nombre">Nombre completo</label>
                    <input type="text" id="client-nombre" placeholder="Ej. Carlos Arrieta">
                    <span class="field-error">Ingresá el nombre del cliente.</span>
                </div>

                <div class="field-row">

                    <div class="field">
                        <label for="client-dni">DNI</label>
                        <input type="text" id="client-dni" placeholder="Ej. 28550112">
                        <span class="field-error">Ingresá el DNI.</span>
                    </div>

                    <div class="field">
                        <label for="client-telefono">Teléfono</label>
                        <input type="text" id="client-telefono" placeholder="Ej. +54 9 387...">
                        <span class="field-error">Ingresá el teléfono.</span>
                    </div>

                </div>

                <div class="field">
                    <label for="client-email">Email</label>
                    <input type="text" id="client-email" placeholder="cliente@email.com">
                </div>

                <div class="field">
                    <label for="client-direccion">Dirección</label>
                    <input type="text" id="client-direccion" placeholder="Dirección del cliente">
                </div>

                <div class="field">
                    <label for="client-saldo">Saldo pendiente</label>
                    <input type="text" id="client-saldo" placeholder="0">
                    <span class="field-error">El saldo no puede ser negativo.</span>
                </div>

                <div class="modal-foot">
                    <button type="button" class="btn-ghost" id="client-cancel">
                        Cancelar
                    </button>

                    <button type="submit" class="btn-solid">
                        Guardar cliente
                    </button>
                </div>

            </div>
        </form>

    </div>
</div>

<script src="/js/Clientes.js"></script>

</body>
</html>
