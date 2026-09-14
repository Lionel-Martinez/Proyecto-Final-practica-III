<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceso Técnico · Ulicel</title>
    <link rel="stylesheet" href="../css/login.css">
  </head>
  <body>

    <div class="auth-shell">

      <aside class="panel-brand">
        <div class="grid-overlay" aria-hidden="true"></div>

        <div class="brand-top">
          <div class="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 1 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 1 1 5.4-5.4z"></path></svg>
            <span>Ulicel</span>
          </div>
          <p class="brand-tag">Service Management System</p>
        </div>

        <div class="brand-mid">
          <h2>Un solo panel<br>para todo el taller.</h2>
          <ul class="feature-tags">
            <li>Órdenes de trabajo</li>
            <li>Inventario</li>
            <li>Clientes</li>
            <li>Facturación</li>
          </ul>
        </div>

        <p class="brand-foot">Sistema interno · uso exclusivo del personal técnico.</p>
      </aside>

      <main class="panel-form">
        <div class="form-wrap">

          <p class="eyebrow">Panel de acceso</p>
          <h1>Identificate para continuar</h1>
          <p class="lead">Usá las credenciales que te asignó administración.</p>

          <form id="login-form" method="POST" action="{{ route('login.store') }}" novalidate>
            @csrf

            <div class="field">
              <label for="username">Usuario</label>
              <div class="input-shell">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </span>
                <input type="text" id="username" name="username" value="{{ old('username') }}" placeholder="admin_ulicel" autocomplete="username" required autofocus>
              </div>
              <span class="field-error" id="username-error">Ingresá tu usuario para continuar.</span>
            </div>

            <div class="field">
              <div class="field-head">
                <label for="password">Contraseña</label>
                <a href="#" class="forgot">¿Olvidó su clave?</a>
              </div>
              <div class="input-shell">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="10" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path></svg>
                </span>
                <input type="password" id="password" name="password" placeholder="••••••••" autocomplete="current-password" required>
                <button type="button" class="toggle-visibility" id="toggle-password" aria-label="Mostrar contraseña" aria-pressed="false">
                  <svg class="icon-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  <svg class="icon-eye-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" hidden><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.6 21.6 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a21.6 21.6 0 0 1-2.61 3.68"></path><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                </button>
              </div>
              <span class="field-error" id="password-error">Ingresá tu contraseña para continuar.</span>
            </div>

            <button type="submit" class="submit-btn" id="submit-btn">
              <span class="btn-label">Ingresar</span>
              <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              <span class="btn-spinner" hidden></span>
            </button>

            <p class="form-alert {{ $errors->has('username') ? '' : 'success' }}" id="form-alert" role="alert" @unless($errors->has('username')) hidden @endunless>{{ $errors->first('username') }}</p>

          </form>

          <div class="status-line">
            <span class="status-dot" id="status-dot"></span>
            <span id="status-text">Servidor Norte-1 activo</span>
            <span class="status-version">v2.4.0-stable</span>
          </div>

          <p class="support-line">¿Problemas para entrar? <a href="#">Contactar a Soporte TI</a></p>

        </div>
      </main>

    </div>

    <script src="../js/login.js"></script>
  </body>
</html>
