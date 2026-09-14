/* ==========================================================
   BÚSQUEDA GLOBAL
   Cruza tres claves de localStorage que ya llenan otras
   pantallas: "ulicel_clientes", "ulicel_ordenes" e
   "ulicel_inventario". No hace falta ningún dato nuevo: esto
   es una vista de lectura sobre lo que ya existe.
   ========================================================== */

const ICONS = {
  cliente: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
  orden: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 8-8"></path><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"></path></svg>',
  repuesto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="1"></rect><path d="M3 8 5 3h14l2 5"></path><line x1="10" y1="12" x2="14" y2="12"></line></svg>',
};

const ESTADO_LABEL = { pendiente: "Pendiente", progreso: "En Progreso", entregada: "Entregada" };

function loadLS(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (e) {
    return [];
  }
}

function buscar(query) {
  const q = query.trim().toLowerCase();
  const contenedor = document.getElementById("buscar-resultados");

  if (!q) {
    contenedor.innerHTML = `<p class="buscar-empty">Empezá a escribir para buscar en todo el sistema.</p>`;
    return;
  }

  const clientes = loadLS("ulicel_clientes").filter(
    (c) =>
      c.nombre.toLowerCase().includes(q) ||
      (c.dni || "").toLowerCase().includes(q) ||
      (c.telefono || "").toLowerCase().includes(q)
  );

  const ordenes = loadLS("ulicel_ordenes").filter(
    (o) =>
      o.id.toLowerCase().includes(q) ||
      o.titulo.toLowerCase().includes(q) ||
      (o.cliente || "").toLowerCase().includes(q) ||
      (o.falla || "").toLowerCase().includes(q)
  );

  const repuestos = loadLS("ulicel_inventario").filter(
    (r) =>
      r.nombre.toLowerCase().includes(q) ||
      r.sku.toLowerCase().includes(q) ||
      r.categoria.toLowerCase().includes(q)
  );

  if (clientes.length === 0 && ordenes.length === 0 && repuestos.length === 0) {
    contenedor.innerHTML = `<p class="buscar-empty">Sin resultados para "${query}".</p>`;
    return;
  }

  let html = "";

  if (clientes.length) {
    html += `
      <div class="buscar-grupo">
        <p class="buscar-grupo-title">Clientes <span class="count">${clientes.length}</span></p>
        ${clientes
          .map(
            (c) => `
          <a class="buscar-resultado" href="Cliente.html?id=${c.id}">
            <span class="buscar-icon">${ICONS.cliente}</span>
            <span class="buscar-texto">
              <strong>${c.nombre}</strong>
              <span>DNI ${c.dni} · ${c.telefono || "sin teléfono"}</span>
            </span>
            ${c.saldo > 0 ? `<span class="buscar-badge badge-saldo">Debe $${c.saldo.toLocaleString("es-AR")}</span>` : ""}
          </a>
        `
          )
          .join("")}
      </div>
    `;
  }

  if (ordenes.length) {
    html += `
      <div class="buscar-grupo">
        <p class="buscar-grupo-title">Órdenes <span class="count">${ordenes.length}</span></p>
        ${ordenes
          .map(
            (o) => `
          <a class="buscar-resultado" href="Work queue.html">
            <span class="buscar-icon">${ICONS.orden}</span>
            <span class="buscar-texto">
              <strong>#${o.id} — ${o.titulo}</strong>
              <span>${o.cliente} · ${o.falla}</span>
            </span>
            <span class="buscar-badge badge-${o.status}">${ESTADO_LABEL[o.status] || o.status}</span>
          </a>
        `
          )
          .join("")}
      </div>
    `;
  }

  if (repuestos.length) {
    html += `
      <div class="buscar-grupo">
        <p class="buscar-grupo-title">Repuestos <span class="count">${repuestos.length}</span></p>
        ${repuestos
          .map(
            (r) => `
          <a class="buscar-resultado" href="inventory.html">
            <span class="buscar-icon">${ICONS.repuesto}</span>
            <span class="buscar-texto">
              <strong>${r.nombre}</strong>
              <span>SKU ${r.sku} · ${r.categoria} · quedan ${r.stock} u.</span>
            </span>
            ${r.stock <= 10 ? `<span class="buscar-badge badge-agotandose">Agotándose</span>` : ""}
          </a>
        `
          )
          .join("")}
      </div>
    `;
  }

  contenedor.innerHTML = html;
}

const input = document.getElementById("buscar-input");
input.addEventListener("input", (e) => buscar(e.target.value));

// si llega con ?q= desde algún lado, arranca precargado
const q = new URLSearchParams(window.location.search).get("q");
if (q) {
  input.value = q;
  buscar(q);
}