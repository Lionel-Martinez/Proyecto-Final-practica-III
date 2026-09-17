<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta
        name="csrf-token"
        content="{{ csrf_token() }}"
    >

    <title>Proveedores - Ulicel</title>

    <link rel="stylesheet" href="{{ asset('css/menu principal.css') }}">
    <link rel="stylesheet" href="{{ asset('css/Proveedores.css') }}">
</head>

<body>
    <main
    class="proveedores-page"
    data-api-url="{{ url('/api/proveedores') }}"
    >
        <header class="page-header">
            <div>
                <p class="page-eyebrow">
                    Ulicel / Gestión
                </p>

                <h1>Proveedores</h1>

                <p>
                    Administrá los proveedores de Ulicel.
                </p>
                <button
                    type="button"
                    id="add-supplier-btn"
                >
                Agregar proveedor
                </button>
            </div>

            <div
    id="supplier-modal"
    class="supplier-modal"
    hidden
>
    <div class="supplier-modal-content">

        <div class="supplier-modal-header">

            <h2 id="supplier-modal-title">
                Agregar proveedor
            </h2>

            <button
                type="button"
                id="supplier-modal-close"
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
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                >
                    Guardar proveedor
                </button>

            </div>

        </form>

    </div>
</div>
        </header>

        <section class="suppliers-section">

            <div id="suppliers-container">
                Cargando proveedores...
            </div>

        </section>

    </main>

<script src="{{ asset('js/proveedores.js') }}"></script>
</body>
</html>
