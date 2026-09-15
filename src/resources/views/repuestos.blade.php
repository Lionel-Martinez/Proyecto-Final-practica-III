<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="ulicel-user-role" content="{{ auth()->user()->role }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Repuestos — Ulicel</title>

    <link rel="stylesheet" href="/css/menu principal.css">
    <link rel="stylesheet" href="/css/Repuestos.css">
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

        <a href="#" class="icons-header" aria-label="Buscar">
            <img
                src="/img/menu principal/search.svg"
                alt="buscar"
            >
        </a>

        <a href="#" class="icons-header" aria-label="Ayuda">
            <img
                src="/img/menu principal/question.svg"
                alt="ayuda"
            >
        </a>

        <a href="#" class="icons-header" aria-label="Notificaciones">
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

<main>

    <div
        class="repuestos-page"
        data-api-url="{{ url('/api/repuestos') }}"
    >

        <div class="page-header">

            <div>
                <p class="page-eyebrow">
                    Inventario
                </p>

                <h1>
                    Repuestos
                </h1>

                <p>
                    Gestioná el stock y los precios de los repuestos.
                </p>
            </div>

            <button
                type="button"
                id="add-part-btn"
            >
                + Agregar repuesto
            </button>

        </div>

        <section class="parts-section">

            <div id="parts-container">

                <div class="client-empty-section">
                    Cargando repuestos...
                </div>

            </div>

        </section>

            </section>

        <div
            class="modal-overlay"
            id="part-modal"
            hidden
        >

            <div
                class="modal-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="part-modal-title"
            >

                <div class="modal-head">

                    <h2 id="part-modal-title">
                        Agregar repuesto
                    </h2>

                    <button
                        type="button"
                        class="modal-close"
                        id="part-modal-close"
                        aria-label="Cerrar"
                    >
                        ×
                    </button>

                </div>

                <form id="part-form">

                    <div class="modal-body">

                        <div class="field">
                            <label for="part-sku">
                                SKU
                            </label>

                            <input
                                type="text"
                                id="part-sku"
                                name="sku"
                                maxlength="50"
                                required
                            >
                        </div>

                        <div class="field">
                            <label for="part-name">
                                Nombre
                            </label>

                            <input
                                type="text"
                                id="part-name"
                                name="name"
                                maxlength="100"
                                required
                            >
                        </div>

                        <div class="field-row">

                            <div class="field">
                                <label for="part-stock">
                                    Stock actual
                                </label>

                                <input
                                    type="number"
                                    id="part-stock"
                                    name="current_stock"
                                    min="0"
                                    value="0"
                                    required
                                >
                            </div>

                            <div class="field">
                                <label for="part-minimum-stock">
                                    Stock mínimo
                                </label>

                                <input
                                    type="number"
                                    id="part-minimum-stock"
                                    name="minimum_stock"
                                    min="0"
                                    value="0"
                                    required
                                >
                            </div>

                        </div>

                        <div class="field-row">

                            <div class="field">
                                <label for="part-cost">
                                    Precio de costo
                                </label>

                                <input
                                    type="number"
                                    id="part-cost"
                                    name="cost_price"
                                    min="0"
                                    step="0.01"
                                    value="0"
                                    required
                                >
                            </div>

                            <div class="field">
                                <label for="part-sale">
                                    Precio de venta
                                </label>

                                <input
                                    type="number"
                                    id="part-sale"
                                    name="sale_price"
                                    min="0"
                                    step="0.01"
                                    value="0"
                                    required
                                >
                            </div>

                        </div>

                    </div>

                    <div class="modal-foot">

                        <button
                            type="button"
                            class="btn-ghost"
                            id="part-modal-cancel"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            class="btn-solid"
                        >
                            Guardar repuesto
                        </button>

                    </div>

                </form>

            </div>

        </div>

    </div>

</main>

<script src="/js/repuestos.js"></script>

</body>
</html>
