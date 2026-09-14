/* ==========================================================
   PROVEEDORES + PEDIDO DE REPOSICIÓN
   Proveedores persistidos en "ulicel_proveedores". El pedido de
   reposición lee "ulicel_inventario" (la misma clave que usa
   Inventory) y agrupa los repuestos por debajo del umbral según
   la categoría de cada proveedor.
   ========================================================== */

const STORAGE_KEY = "ulicel_proveedores";
const LOW_STOCK_THRESHOLD = 10; // debe coincidir con el de inventory.js

const SEED_PROVEEDORES = [
  { id: "p1", nombre: "Repuestos del Norte", categoria: "Sistema Eléctrico", telefono: "5493870001111", email: "ventas@repuestosnorte.com" },
  { id: "p2", nombre: "Lubricentro Salta", categoria: "Motor / Lubricación", telefono: "5493870002222", email: "" },
  { id: "p3", nombre: "Frenos y Cía.", categoria: "Seguridad / Frenado", telefono: "5493870003333", email: "pedidos@frenosycia.com" },
];

function loadProveedores() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("No se pudo leer localStorage, usando datos de ejemplo.", e);
  }
  saveProveedores(SEED_PROVEEDORES);
  return SEED_PROVEEDORES;
}

function saveProveedores(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

let proveedores = loadProveedores();
let currentSearch = "";

/* ---------- render ---------- */

function getFiltered() {
  const q = currentSearch.trim().toLowerCase();
  if (!q) return proveedores;
  return proveedores.filter(
    (p) => p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q)
  );
}

function renderCategoriasDatalist() {
  const categorias = [...new Set(proveedores.map((p) => p.categoria))];
  document.getElementById("prov-categoria-options").innerHTML = categorias
    .map((c) => `<option value="${c}">`)
    .join("");
}

function renderGrid() {
  const filtered = getFiltered();
  const grid = document.getElementById("prov-grid");
  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="prov-empty">No encontramos proveedores con ese criterio.</p>`;
  } else {
    filtered.forEach((p) => {
      const card = document.createElement("article");
      card.className = "prov-card";
      card.dataset.id = p.id;
      card.innerHTML = `
        <div class="prov-head">
          <div>
            <span class="prov-nombre">${p.nombre}</span>
            <span class="prov-categoria">${p.categoria}</span>
          </div>
          <button type="button" class="prov-menu-btn" aria-label="Acciones">
            <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6"></circle><circle cx="12" cy="12" r="1.6"></circle><circle cx="12" cy="19" r="1.6"></circle></svg>
          </button>
          <ul class="prov-menu" hidden>
            <li data-action="editar">Editar</li>
            <li data-action="eliminar" class="danger">Eliminar</li>
          </ul>
        </div>
        ${p.email ? `<div class="prov-detail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 6 12 13 2 6"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>${p.email}</div>` : ""}
        <a class="prov-whatsapp" href="https://wa.me/${p.telefono}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.5 3.58 1.36 5.08L2 22l5.19-1.44a9.87 9.87 0 0 0 4.85 1.24h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2zm0 18.06h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.86.83-3.03-.2-.31a8.16 8.16 0 0 1-1.26-4.34c0-4.52 3.69-8.2 8.24-8.2 2.2 0 4.27.86 5.82 2.42a8.14 8.14 0 0 1 2.41 5.79c0 4.52-3.69 8.14-8.23 8.14z"></path></svg>
          Escribir por WhatsApp
        </a>
      `;
      grid.appendChild(card);
    });
  }

  renderCategoriasDatalist();
}

document.getElementById("search-input").addEventListener("input", (e) => {
  currentSearch = e.target.value;
  renderGrid();
});

/* ---------- modal: nuevo / editar proveedor ---------- */

const overlay = document.getElementById("prov-overlay");
const form = document.getElementById("prov-form");
const modalTitle = document.getElementById("prov-modal-title");

function openModal(proveedor) {
  form.reset();
  document.querySelectorAll("#prov-form .field").forEach((f) => f.classList.remove("has-error"));

  if (proveedor) {
    modalTitle.textContent = "Editar Proveedor";
    document.getElementById("prov-id").value = proveedor.id;
    document.getElementById("prov-nombre").value = proveedor.nombre;
    document.getElementById("prov-categoria").value = proveedor.categoria;
    document.getElementById("prov-telefono").value = proveedor.telefono;
    document.getElementById("prov-email").value = proveedor.email || "";
  } else {
    modalTitle.textContent = "Nuevo Proveedor";
    document.getElementById("prov-id").value = "";
  }

  overlay.hidden = false;
  document.getElementById("prov-nombre").focus();
}

function closeModal() {
  overlay.hidden = true;
}

document.getElementById("btn-nuevo-proveedor").addEventListener("click", () => openModal(null));
document.getElementById("prov-modal-close").addEventListener("click", closeModal);
document.getElementById("prov-cancel").addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nombreInput = document.getElementById("prov-nombre");
  const categoriaInput = document.getElementById("prov-categoria");
  const telefonoInput = document.getElementById("prov-telefono");

  let isValid = true;
  [nombreInput, categoriaInput, telefonoInput].forEach((input) => {
    const empty = !input.value.trim();
    input.closest(".field").classList.toggle("has-error", empty);
    if (empty) isValid = false;
  });
  if (!isValid) return;

  const id = document.getElementById("prov-id").value;
  const payload = {
    id: id || `p${Date.now()}`,
    nombre: nombreInput.value.trim(),
    categoria: categoriaInput.value.trim(),
    telefono: telefonoInput.value.trim().replace(/[^0-9]/g, ""),
    email: document.getElementById("prov-email").value.trim(),
  };

  if (id) {
    proveedores = proveedores.map((p) => (p.id === id ? payload : p));
  } else {
    proveedores.push(payload);
  }

  saveProveedores(proveedores);
  renderGrid();
  closeModal();
});

/* ---------- menú de acciones por card (delegado) ---------- */

document.addEventListener("click", (event) => {
  const menuBtn = event.target.closest(".prov-menu-btn");

  document.querySelectorAll(".prov-menu").forEach((menu) => {
    if (!menuBtn || menu !== menuBtn.nextElementSibling) menu.hidden = true;
  });

  if (menuBtn) {
    menuBtn.nextElementSibling.hidden = !menuBtn.nextElementSibling.hidden;
    return;
  }

  const actionItem = event.target.closest(".prov-menu li");
  if (!actionItem) return;

  const id = actionItem.closest(".prov-card").dataset.id;
  const proveedor = proveedores.find((p) => p.id === id);

  if (actionItem.dataset.action === "editar") {
    openModal(proveedor);
  } else if (actionItem.dataset.action === "eliminar") {
    if (confirm(`¿Eliminar a "${proveedor.nombre}" de proveedores?`)) {
      proveedores = proveedores.filter((p) => p.id !== id);
      saveProveedores(proveedores);
      renderGrid();
    }
  }
  actionItem.closest(".prov-menu").hidden = true;
});

/* ==========================================================
   PEDIDO DE REPOSICIÓN
   Cruza el inventario real (misma clave que usa inventory.js)
   con los proveedores, agrupando por categoría.
   ========================================================== */

const pedidoOverlay = document.getElementById("pedido-overlay");

function loadInventario() {
  try {
    return JSON.parse(localStorage.getItem("ulicel_inventario") || "[]");
  } catch (e) {
    return [];
  }
}

function buildMensaje(proveedorNombre, items) {
  const lineas = items.map((i) => `• ${i.nombre} (SKU ${i.sku}) — quedan ${i.stock} u.`);
  return `Hola ${proveedorNombre}, ¿nos pueden cotizar reposición de estos repuestos?\n\n${lineas.join("\n")}\n\nGracias, Ulicel Tech.`;
}

function renderPedido() {
  const bajos = loadInventario().filter((p) => p.stock <= LOW_STOCK_THRESHOLD);
  const contenedor = document.getElementById("pedido-grupos");

  if (bajos.length === 0) {
    contenedor.innerHTML = `<p class="pedido-empty">✓ No hay repuestos por debajo del umbral de stock ahora mismo.</p>`;
    return;
  }

  const porCategoria = {};
  bajos.forEach((item) => {
    if (!porCategoria[item.categoria]) porCategoria[item.categoria] = [];
    porCategoria[item.categoria].push(item);
  });

  contenedor.innerHTML = Object.entries(porCategoria)
    .map(([categoria, items], idx) => {
      const proveedor = proveedores.find(
        (p) => p.categoria.toLowerCase() === categoria.toLowerCase()
      );
      const mensaje = buildMensaje(proveedor ? proveedor.nombre : categoria, items);
      const textareaId = `pedido-msg-${idx}`;

      return `
        <div class="pedido-grupo">
          <div class="pedido-grupo-head">
            <strong>${categoria}</strong>
            <span class="servicio-categoria-tag">${items.length} repuesto${items.length === 1 ? "" : "s"}</span>
          </div>
          <ul class="pedido-items">
            ${items.map((i) => `<li>${i.nombre} — quedan ${i.stock} u. (SKU ${i.sku})</li>`).join("")}
          </ul>
          <textarea class="pedido-textarea" id="${textareaId}" readonly>${mensaje}</textarea>
          <div class="pedido-actions">
            <button type="button" class="pedido-copy" data-target="${textareaId}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              Copiar mensaje
            </button>
            ${
              proveedor
                ? `<a class="pedido-whatsapp" href="https://wa.me/${proveedor.telefono}?text=${encodeURIComponent(mensaje)}" target="_blank" rel="noopener">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.5 3.58 1.36 5.08L2 22l5.19-1.44a9.87 9.87 0 0 0 4.85 1.24h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2z"></path></svg>
                    Enviar a ${proveedor.nombre}
                  </a>`
                : ""
            }
          </div>
          ${!proveedor ? `<p class="pedido-sin-proveedor">No hay un proveedor cargado para "${categoria}" — copiá el mensaje y mandalo a mano.</p>` : ""}
        </div>
      `;
    })
    .join("");
}

document.getElementById("btn-pedido").addEventListener("click", () => {
  renderPedido();
  pedidoOverlay.hidden = false;
});
document.getElementById("pedido-modal-close").addEventListener("click", () => {
  pedidoOverlay.hidden = true;
});
pedidoOverlay.addEventListener("click", (e) => {
  if (e.target === pedidoOverlay) pedidoOverlay.hidden = true;
});

document.addEventListener("click", (event) => {
  const copyBtn = event.target.closest(".pedido-copy");
  if (!copyBtn) return;
  const textarea = document.getElementById(copyBtn.dataset.target);
  textarea.select();
  navigator.clipboard?.writeText(textarea.value).catch(() => {
    document.execCommand("copy");
  });
  copyBtn.textContent = "¡Copiado!";
  setTimeout(() => {
    copyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copiar mensaje`;
  }, 1500);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    overlay.hidden = true;
    pedidoOverlay.hidden = true;
  }
});

/* ---------- primer render ---------- */

renderGrid();