<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="ulicel-user-role" content="{{ auth()->user()->role }}">
  <title>Menu Principal</title>
  <link rel="stylesheet" href="../css/menu principal.css">
</head>
<body>

  <header>
    <div class="izquierda">
      <div class="brand">
        <img src="../img/ulicel-logo.jpeg" alt="Ulicel Logo" class="logo">
        <span class="name">Ulicel</span>
      </div>
    </div>
    <div class="derecha">
      <a href="Buscar.html" class="icons-header" aria-label="Buscar">
        <img src="../img/menu principal/search.svg" alt="buscar">
      </a>
      <a href="Ayuda.html" class="icons-header" aria-label="Ayuda">
        <img src="../img/menu principal/question.svg" alt="ayuda">
      </a>
      <a href="notificaciones.html" class="icons-header" aria-label="Notificaciones">
        <img src="../img/menu principal/notification.svg" alt="notificaciones">
        <span class="notif-dot" id="notif-dot" hidden></span>
      </a>
      <div class="user-block">
        <img src="../img/ulicel-logo.jpeg" alt="img-user" class="user">
        <span class="role-badge" id="role-badge">{{ ucfirst(auth()->user()->role) }}</span>
      </div>
      <form method="POST" action="{{ route('logout') }}">
        @csrf
        <button type="submit" class="icons-header" aria-label="Cerrar sesión">Salir</button>
      </form>
    </div>
  </header>
  <main id="main" class="main-full">

    <div class="launcher-layout">

      <div class="launcher-main">

        <div class="launcher-head">
          <p class="launcher-eyebrow">Panel de Control</p>
          <h1 id="launcher-title">Hola, Admin.</h1>
          <p id="launcher-sub">Tenés acceso completo al sistema: gestión, ventas y configuración.</p>
        </div>

        <a href="#" class="cta-banner launcher-action" data-action="nueva-orden" data-roles="admin,tecnico,mostrador">
          <span class="cta-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </span>
          <span class="cta-text">
            <strong>Nueva Orden de Reparación</strong>
            <span>Registrá un equipo y arrancá el ticket en un par de clics</span>
          </span>
          <svg class="cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </a>

        <p class="access-heading">Accesos</p>

        <div class="access-list" id="access-list">

          <a href="#" class="access-row launcher-action" data-action="clientes" data-roles="admin,mostrador">
            <span class="access-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path><circle cx="10" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </span>
            <span class="access-text">
              <strong>Clientes</strong>
              <span>Gestión CRM</span>
            </span>
            <svg class="access-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>

          <a href="#" class="access-row launcher-action" data-action="prioridades" data-roles="admin,tecnico">
            <span class="access-icon access-icon-alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"></circle><path d="M12 9v4l2.5 2.5"></path><path d="M5 3 3 5"></path><path d="M19 3l2 2"></path></svg>
            </span>
            <span class="access-text">
              <strong>Prioridades</strong>
              <span>Alertas críticas</span>
            </span>
            <span class="access-badge">4 urgente</span>
            <svg class="access-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>

          <a href="#" class="access-row launcher-action" data-action="stock" data-roles="admin,tecnico">
            <span class="access-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="1"></rect><path d="M3 8 5 3h14l2 5"></path><line x1="10" y1="12" x2="14" y2="12"></line></svg>
            </span>
            <span class="access-text">
              <strong>Stock</strong>
              <span>Repuestos &amp; partes</span>
            </span>
            <svg class="access-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>

          <a href="#" class="access-row launcher-action" data-action="ordenes-activas" data-roles="admin,tecnico,mostrador">
            <span class="access-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 8-8"></path><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"></path></svg>
            </span>
            <span class="access-text">
              <strong>Órdenes Activas</strong>
              <span>En progreso</span>
            </span>
            <svg class="access-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>

          <a href="#" class="access-row launcher-action" data-action="caja" data-roles="admin,mostrador">
            <span class="access-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="3"></circle></svg>
            </span>
            <span class="access-text">
              <strong>Caja/Factura</strong>
              <span>Transacciones</span>
            </span>
            <svg class="access-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>

          <a href="#" class="access-row launcher-action" data-action="rentabilidad" data-roles="admin">
            <span class="access-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="21" x2="5" y2="12"></line><line x1="12" y1="21" x2="12" y2="7"></line><line x1="19" y1="21" x2="19" y2="15"></line></svg>
            </span>
            <span class="access-text">
              <strong>Rentabilidad</strong>
              <span>Métricas KPI</span>
            </span>
            <svg class="access-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>

          <a href="#" class="access-row launcher-action" data-action="admin" data-roles="admin">
            <span class="access-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 3.9l.06.06A1.65 1.65 0 0 0 8.92 4.3H9a1.65 1.65 0 0 0 1-1.51V2.7a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </span>
            <span class="access-text">
              <strong>Admin</strong>
              <span>Configuración</span>
            </span>
            <svg class="access-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>

        </div>

        <p class="empty-state" id="empty-state" hidden>No tenés herramientas disponibles para tu rol todavía.</p>

      </div>

      <aside class="launcher-aside">

        <div class="aside-card">
          <p class="aside-title">Resumen de turno</p>
          <ul class="stat-list" id="stat-list">
            <li data-roles="admin,tecnico">
              <a href="Work queue.html">
                <span>Urgentes</span>
                <strong class="stat-red">3</strong>
              </a>
            </li>
            <li data-roles="admin,tecnico,recepcion">
              <a href="Work queue.html">
                <span>Órdenes activas</span>
                <strong>12</strong>
              </a>
            </li>
            <li data-roles="admin,tecnico">
              <a href="inventory.html">
                <span>Stock bajo</span>
                <strong class="stat-red">4</strong>
              </a>
            </li>
            <li data-roles="admin">
              <a href="Analytics.html">
                <span>Ganancia del mes</span>
                <strong class="stat-green">$243,350</strong>
              </a>
            </li>
          </ul>
        </div>

        <div class="aside-card console-card">
          <p class="aside-title">
            <span class="console-dot"></span>
            Actividad reciente
          </p>
          <ul class="activity-feed">
            <li><span class="activity-time">10:41</span> Orden #RO-1120-K entregada</li>
            <li><span class="activity-time">10:22</span> Trabajo iniciado en #RO-8842-X</li>
            <li><span class="activity-time">09:57</span> Nuevo repuesto agregado a Stock</li>
            <li><span class="activity-time">09:30</span> Orden #RO-9011-B marcada crítica</li>
          </ul>
        </div>

      </aside>

    </div>

  </main>

  <script src="../js/menu principal.js"></script>
</body>
</html>
