@extends('layouts.ulicel')

@section('titulo', 'Ayuda — Ulicel')

@section('content')

    <p class="breadcrumb">
        <a href="{{ route('dashboard') }}">Launcher</a>
        <span>/</span>
        <strong>Ayuda</strong>
    </p>

    <div class="launcher-head">
        <h1>Ayuda y Soporte</h1>
        <p>Respuestas rápidas a lo más usado, y una vía directa si no encontrás lo que buscás.</p>
    </div>

    <div class="ayuda-grid">

        <div class="ayuda-main">

            <p class="ayuda-kicker">Preguntas frecuentes</p>

            <details class="faq-item" open>
                <summary>¿Cómo registro una reparación nueva?</summary>
                <p>Desde el botón <strong>"New Repair"</strong> del menú, o la card <strong>"Nueva Orden de Reparación"</strong> del Launcher. Es un formulario de 4 pasos: datos del cliente (con búsqueda automática por DNI si ya existe), datos del equipo, estado de ingreso (foto + checklist) y una revisión final. Al confirmar, se genera un código de seguimiento con QR para el cliente.</p>
                <a class="faq-link" href="{{ route('ordenes.create') }}">Ir a Nueva Orden →</a>
            </details>

            <details class="faq-item">
                <summary>¿Cómo genero un presupuesto para un cliente?</summary>
                <p>En <strong>Lista de Precios</strong>, tildá los servicios que necesitás cotizar y apretá "Generar Presupuesto". Se arma un documento imprimible o para enviar por WhatsApp, con el detalle y el total.</p>
                <a class="faq-link" href="{{ route('catalogo.index') }}">Ir a Lista de Precios →</a>
            </details>

            <details class="faq-item">
                <summary>¿Cómo marco una reparación como entregada?</summary>
                <p>En <strong>Work Queue</strong>: "Iniciar reparación" la pasa a En Progreso, "Marcar como listo" la deja pendiente de retiro, y "Confirmar entrega" (con foto de egreso obligatoria) la marca como Entregada. En ese último paso se genera automáticamente la garantía digital con su QR.</p>
                <a class="faq-link" href="{{ route('work-queue.index') }}">Ir a Work Queue →</a>
            </details>

            <details class="faq-item">
                <summary>¿Cómo agrego un cliente nuevo?</summary>
                <p>Desde <strong>Clientes</strong>, con el botón "Nuevo cliente". Podés cargar nombre, DNI, teléfono, email, dirección y saldo pendiente si corresponde. También se crea automáticamente si cargás un DNI nuevo desde el asistente de Nueva Orden.</p>
                <a class="faq-link" href="{{ route('clientes.index') }}">Ir a Clientes →</a>
            </details>

            <details class="faq-item">
                <summary>¿Cómo controlo el stock bajo de repuestos?</summary>
                <p><strong>Stock</strong> muestra una alerta cuando un repuesto está en o por debajo de su stock mínimo, y también aparece en <strong>Notificaciones</strong>. Desde ahí podés editar la cantidad o el mínimo de cada repuesto.</p>
                <a class="faq-link" href="{{ route('repuestos.index') }}">Ir a Stock →</a>
            </details>

            <details class="faq-item">
                <summary>¿Cómo hace el cliente para ver el estado de su reparación?</summary>
                <p>Al registrar la orden, el sistema genera un código y un QR únicos. El cliente escanea el QR (o abre el link) desde su celular y ve el estado actualizado en tiempo real, sin necesidad de loguearse. Cuando la orden queda "Entregada", ahí mismo aparece el certificado de garantía digital.</p>
            </details>

            <details class="faq-item">
                <summary>¿Quién puede ver cada pantalla del sistema?</summary>
                <p>El acceso depende del rol de cada usuario (Admin, Técnico o Mostrador), asignado al crear su cuenta desde <strong>Admin → Usuarios y Accesos</strong>. Cada rol ve solo las secciones del menú que le corresponden, y el sistema también lo verifica del lado del servidor — no alcanza con conocer la URL.</p>
            </details>

        </div>

        <aside class="ayuda-aside">
            <div class="soporte-card">
                <p class="soporte-title">¿No encontraste lo que buscabas?</p>
                <p class="soporte-text">El contacto directo por WhatsApp todavía no está configurado.</p>
                <span class="btn-whatsapp is-disabled">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.5 3.58 1.36 5.08L2 22l5.19-1.44a9.87 9.87 0 0 0 4.85 1.24h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2z"></path></svg>
                    Próximamente
                </span>
            </div>

            <div class="atajos-card">
                <p class="atajos-title">Accesos rápidos</p>
                <a class="atajo-row" href="{{ route('ordenes.create') }}">Nueva Orden</a>
                <a class="atajo-row" href="{{ route('work-queue.index') }}">Work Queue</a>
                <a class="atajo-row" href="{{ route('clientes.index') }}">Clientes</a>
                <a class="atajo-row" href="{{ route('repuestos.index') }}">Stock</a>
                <a class="atajo-row" href="{{ route('catalogo.index') }}">Lista de Precios</a>
                @if (auth()->user()->role === 'admin')
                    <a class="atajo-row" href="{{ route('admin.index') }}">Admin</a>
                @endif
            </div>
        </aside>

    </div>

@endsection

@push('styles')
    <link rel="stylesheet" href="/css/ayuda.css">
@endpush
