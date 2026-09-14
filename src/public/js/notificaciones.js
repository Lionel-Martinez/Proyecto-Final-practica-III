/* ==========================================================
   NOTIFICACIONES (página completa)
   Reutiliza buildNotifications() de "menu principal.js" (ya
   cargado antes que este archivo), que cruza en vivo:
   - Órdenes urgentes/críticas sin iniciar (Work Queue)
   - Repuestos con stock bajo (Inventory)
   - Clientes con saldo pendiente (Clientes)
   ========================================================== */

const ICONS_PAGE = {
  urgente: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  stock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="1"></rect><path d="M3 8 5 3h14l2 5"></path><line x1="10" y1="12" x2="14" y2="12"></line></svg>',
  saldo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
};

const TAG_LABEL = { urgente: "Urgente", stock: "Stock bajo", saldo: "Saldo" };

let currentTipo = "todos";

function renderNotifPage() {
  const todas = typeof buildNotifications === "function" ? buildNotifications() : [];
  const filtradas = currentTipo === "todos" ? todas : todas.filter((n) => n.tipo === currentTipo);

  const contenedor = document.getElementById("notif-list-page");

  if (filtradas.length === 0) {
    contenedor.innerHTML = `
      <div class="notif-empty-state">
        <strong>✓ Todo en orden</strong>
        Sin novedades para mostrar${currentTipo !== "todos" ? " en este filtro" : ""} por ahora.
      </div>
    `;
    return;
  }

  contenedor.innerHTML = filtradas
    .map(
      (n) => `
      <a class="notif-card tipo-${n.tipo}" href="${n.href}">
        <span class="notif-card-icon">${ICONS_PAGE[n.tipo] || ""}</span>
        <span class="notif-card-text">
          <strong>${n.titulo}</strong>
          <span>${n.detalle}</span>
        </span>
        <span class="notif-card-tag">${TAG_LABEL[n.tipo] || n.tipo}</span>
      </a>
    `
    )
    .join("");
}

document.getElementById("notif-filter").addEventListener("click", (event) => {
  const chip = event.target.closest(".notif-chip");
  if (!chip) return;
  document.querySelectorAll(".notif-chip").forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  currentTipo = chip.dataset.tipo;
  renderNotifPage();
});

document.getElementById("btn-refrescar").addEventListener("click", renderNotifPage);

renderNotifPage();