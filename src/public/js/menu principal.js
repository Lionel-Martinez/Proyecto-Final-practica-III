const menu = document.getElementById("menu");
const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main");

// En páginas sin sidebar (como el launcher/menú principal) estos
// elementos no existen: el toggle solo se activa si los tres están.
if (menu && sidebar && main) {
  menu.addEventListener("click", () => {
    sidebar.classList.toggle("menu-toggle");
    menu.classList.toggle("menu-toggle");
    main.classList.toggle("menu-toggle");
  });
}

// Botones del launcher: navegan a la pantalla real cuando existe.
// A medida que vayas creando cada pantalla, sumala acá con su
// data-action correspondiente (el mismo valor que ya tiene la card
// en el HTML) y el link se activa solo, sin tocar nada más.
const LAUNCHER_ROUTES = {
  "nueva-orden": "nueva orden.html",
  "prioridades": "Work queue.html",
  "rentabilidad": "Analytics.html",
  "stock": "inventory.html",
  "clientes": "/clientes",
  "ordenes-activas": "Ordenes activas.html",
  "caja": "Caja Factura.html",
  "admin": "Admin.html",
};

const launcherCards = document.querySelectorAll(".launcher-action");

launcherCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    event.preventDefault();
    const action = card.dataset.action;
    const destino = LAUNCHER_ROUTES[action];

    if (destino) {
      window.location.href = destino;
    } else {
      console.log(`"${action}" todavía no tiene pantalla conectada.`);
    }
  });
});

/* ==========================================================
   SISTEMA DE ROLES
   Muestra u oculta ítems del sidebar y del launcher según el
   tipo de usuario logueado. Los roles válidos son:
   "admin" | "tecnico" | "mostrador"

   Hoy el rol se guarda en localStorage y se puede cambiar con
   el selector "DEV" del header (solo para probar las vistas).
   Cuando conectes el login real, reemplazá getCurrentRole() para
   que lea el rol que te devuelva tu backend/sesión, por ejemplo:

     localStorage.setItem("ulicel_role", data.usuario.rol);

   y podés borrar el selector del header sin tocar el resto.
   ========================================================== */

const VALID_ROLES = ["admin", "tecnico", "mostrador"];

const ROLE_LABELS = {
  admin: "Admin",
  tecnico: "Técnico",
  mostrador: "Mostrador",
};

const ROLE_GREETINGS = {
  admin: "Tenés acceso completo al sistema: gestión, ventas y configuración.",
  tecnico: "Estas son tus herramientas de taller: órdenes, stock y prioridades.",
  mostrador: "Acceso rápido para atender clientes, cargar órdenes y cobrar.",
};

function getCurrentRole() {
  const role = document.querySelector('meta[name="ulicel-user-role"]')?.content;
  return VALID_ROLES.includes(role) ? role : "mostrador";
}

function applyRole(role) {
  // sidebar (items del nav + botones del pie: New Repair, Settings, Support)
  document.querySelectorAll(".sidebar li[data-roles], .sidebar-foot [data-roles]").forEach((el) => {
    const roles = el.dataset.roles.split(",");
    el.style.display = roles.includes(role) ? "" : "none";
  });

  // accesos del launcher (banner + filas de la lista)
  let visibleCards = 0;
  document.querySelectorAll(".access-row[data-roles]").forEach((row) => {
    const roles = row.dataset.roles.split(",");
    const visible = roles.includes(role);
    row.style.display = visible ? "" : "none";
    if (visible) visibleCards += 1;
  });

  const emptyState = document.getElementById("empty-state");
  if (emptyState) emptyState.hidden = visibleCards > 0;

  // panel lateral: resumen de turno
  document.querySelectorAll(".stat-list [data-roles]").forEach((stat) => {
    const roles = stat.dataset.roles.split(",");
    stat.style.display = roles.includes(role) ? "" : "none";
  });

  // textos de bienvenida y badge
  const roleLabel = ROLE_LABELS[role] || role;
  const roleBadge = document.getElementById("role-badge");
  if (roleBadge) {
    roleBadge.textContent = roleLabel;
    roleBadge.className = `role-badge role-${role}`;
  }

  const launcherTitle = document.getElementById("launcher-title");
  if (launcherTitle) {
    launcherTitle.textContent = `Hola, ${roleLabel}.`;
  }

  const launcherSub = document.getElementById("launcher-sub");
  if (launcherSub) {
    launcherSub.textContent = ROLE_GREETINGS[role] || "";
  }

}

applyRole(getCurrentRole());

/* ==========================================================
   NOTIFICACIONES
   Se calculan en vivo cruzando las mismas claves de localStorage
   que ya llenan Work Queue, Inventory y Clientes. Acá solo se
   prende el puntito de la campanita del header; el detalle
   completo vive en su propia página: Notificaciones.html.
   ========================================================== */

const LOW_STOCK_THRESHOLD_NOTIF = 10;

const NOTIF_ICONS = {
  urgente: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  stock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="1"></rect><path d="M3 8 5 3h14l2 5"></path><line x1="10" y1="12" x2="14" y2="12"></line></svg>',
  saldo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
};

function loadLS(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (e) {
    return [];
  }
}

function buildNotifications() {
  const notifs = [];

  const ordenes = loadLS("ulicel_ordenes");
  ordenes
    .filter((o) => o.status === "pendiente" && (o.prioridad === "urgente" || o.prioridad === "critico"))
    .forEach((o) => {
      notifs.push({
        tipo: "urgente",
        titulo: `Orden urgente sin iniciar: #${o.id}`,
        detalle: `${o.titulo} — ${o.cliente}`,
        href: "Work queue.html",
      });
    });

  const repuestos = loadLS("ulicel_inventario");
  repuestos
    .filter((r) => r.stock <= LOW_STOCK_THRESHOLD_NOTIF)
    .forEach((r) => {
      notifs.push({
        tipo: "stock",
        titulo: `Stock bajo: ${r.nombre}`,
        detalle: `Quedan ${r.stock} unidades (SKU ${r.sku})`,
        href: "inventory.html",
      });
    });

  const clientes = loadLS("ulicel_clientes");
  clientes
    .filter((c) => (c.saldo || 0) > 0)
    .forEach((c) => {
      notifs.push({
        tipo: "saldo",
        titulo: `${c.nombre} tiene saldo pendiente`,
        detalle: `Debe $${c.saldo.toLocaleString("es-AR")}`,
        href: `Cliente.html?id=${c.id}`,
      });
    });

  return notifs;
}

// solo prende/apaga el puntito rojo del header; el listado
// completo se arma en Notificaciones.html (Notificaciones.js)
const notifDot = document.getElementById("notif-dot");
if (notifDot) {
  notifDot.hidden = buildNotifications().length === 0;
}
