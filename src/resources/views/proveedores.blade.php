<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta
        name="ulicel-user-role"
        content="{{ auth()->user()->role }}"
    >

    <meta
        name="csrf-token"
        content="{{ csrf_token() }}"
    >

    <title>Proveedores — Ulicel</title>

    <link rel="stylesheet" href="/css/menu principal.css">
    <link rel="stylesheet" href="/css/Proveedores.css">
</head>

<body>

<header>

    <div class="izquierda">

        <div class="brand">

            <img
                src="/img/ulicel-logo.jpeg"
                alt="Ulicel Logo"
                class="logo"
            >

            <span class="name">
                Ulicel
            </span>

        </div>

    </div>


    <div class="derecha">

        <a
            href="#"
            class="icons-header"
            aria-label="Buscar"
        >
            <img
                src="/img/menu principal/search.svg"
                alt="buscar"
            >
        </a>


        <a
            href="#"
            class="icons-header"
            aria-label="Ayuda"
        >
            <img
                src="/img/menu principal/question.svg"
                alt="ayuda"
            >
        </a>


        <a
            href="#"
            class="icons-header"
            aria-label="Notificaciones"
        >
            <img
                src="/img/menu principal/notification.svg"
                alt="notificaciones"
            >

            <span
                class="notif-dot"
                id="notif-dot"
                hidden
            ></span>

        </a>


        <div class="user-block">

            <img
                src="/img/ulicel-logo.jpeg"
                alt="img-user"
                class="user"
            >

            <span
                class="role-badge"
                id="role-badge"
            >
                {{ ucfirst(auth()->user()->role) }}
            </span>

        </div>


        <form
            method="POST"
            action="{{ route('logout') }}"
        >

            @csrf

            <button
                type="submit"
                class="icons-header"
                aria-label="Cerrar sesión"
            >
                Salir
            </button>

        </form>

    </div>

</header>


<main
    id="main"
    class="main-full"
>

    <div class="launcher-layout">

        <div class="launcher-main">

            <div class="launcher-head">

                <p class="launcher-eyebrow">
                    Gestión
                </p>

                <h1>
                    Proveedores
                </h1>

                <p>
                    Administrá los proveedores de Ulicel.
                </p>

            </div>


            <div class="inv-toolbar">

                <button
                    type="button"
                    class="btn-solid"
                    id="add-supplier-btn"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    >
                        <line
                            x1="12"
                            y1="5"
                            x2="12"
                            y2="19"
                        ></line>

                        <line
                            x1="5"
                            y1="12"
                            x2="19"
                            y2="12"
                        ></line>
                    </svg>

                    Nuevo proveedor

                </button>

            </div>


            <section
                class="suppliers-section"
            >

                <div
                    id="suppliers-container"
                >
                    Cargando proveedores...
                </div>

            </section>

        </div>

    </div>

</main>


<div
    id="supplier-modal"
    class="supplier-modal"
    hidden
>

    <div
        class="supplier-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="supplier-modal-title"
    >

        <div class="supplier-modal-header">

            <h2 id="supplier-modal-title">
                Agregar proveedor
            </h2>

            <button
                type="button"
                id="supplier-modal-close"
                aria-label="Cerrar"
            >
                ×
            </button>

        </div>


        <form id="supplier-form">

            <label for="supplier-name">
                Nombre
            </label>

            <input
                type="text"
                id="supplier-name"
                name="name"
                required
            >


            <label for="supplier-contact">
                Persona de contacto
            </label>

            <input
                type="text"
                id="supplier-contact"
                name="contact_name"
            >


            <label for="supplier-phone">
                Teléfono
            </label>

            <input
                type="text"
                id="supplier-phone"
                name="phone"
            >


            <label for="supplier-email">
                Email
            </label>

            <input
                type="email"
                id="supplier-email"
                name="email"
            >


            <label for="supplier-address">
                Dirección
            </label>

            <input
                type="text"
                id="supplier-address"
                name="address"
            >


            <div class="supplier-modal-actions">

                <button
                    type="button"
                    id="supplier-modal-cancel"
                    class="btn-ghost"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    class="btn-solid"
                >
                    Guardar proveedor
                </button>

            </div>

        </form>

    </div>

</div>


<script src="/js/proveedores.js"></script>

</body>
</html>
