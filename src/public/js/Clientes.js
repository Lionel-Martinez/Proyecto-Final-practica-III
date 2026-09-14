/* ==========================================================
   CLIENTES — guardado real en localStorage
   Mientras no haya backend, los clientes quedan persistidos en
   este navegador bajo la clave STORAGE_KEY. El día que conectes
   una API real, reemplazá loadClients()/saveClients() por tus
   fetch() y el resto de la pantalla no necesita cambios.
   ========================================================== */

const STORAGE_KEY = "ulicel_clientes";

const SEED_CLIENTS = [
  { id: "c1", nombre: "Carlos Arrieta", dni: "28550112", telefono: "+54 9 387 555-0112", email: "carlos.arrieta@mail.com", direccion: "", saldo: 4500 },
  { id: "c2", nombre: "Sonia Méndez", dni: "31220456", telefono: "+54 9 387 555-0456", email: "", direccion: "Av. San Martín 450", saldo: 0 },
  { id: "c3", nombre: "Tech Corp S.A.", dni: "30-71234567-9", telefono: "+54 9 387 555-0900", email: "compras@techcorp.com", direccion: "Parque Industrial, Lote 12", saldo: 22500 },
];

function loadClients() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("No se pudo leer localStorage, usando datos de ejemplo.", e);
  }
  // primera vez: sembramos con datos de ejemplo para que la pantalla no se vea vacía
  saveClients(SEED_CLIENTS);
  return SEED_CLIENTS;
}

function saveClients(clients) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

let clients = loadClients();
let currentSearch = "";
let currentFiltro = "todos";

const currency = (n) =>
  `$${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ---------- render ---------- */

function getFilteredClients() {
  const q = currentSearch.trim().toLowerCase();
  return clients.filter((c) => {
    const matchesSearch =
      !q ||
      c.nombre.toLowerCase().includes(q) ||
      c.dni.toLowerCase().includes(q) ||
      c.telefono.toLowerCase().includes(q);
    const matchesSaldo = currentFiltro === "todos" || (c.saldo || 0) > 0;
    return matchesSearch && matchesSaldo;
  });
}

/* ---------- resumen de saldos pendientes ---------- */

function renderSaldoBanner() {
  const conSaldo = clients.filter((c) => (c.saldo || 0) > 0);
  const banner = document.getElementById("saldo-banner");

  if (conSaldo.length === 0) {
    banner.hidden = true;
    return;
  }

  const total = conSaldo.reduce((sum, c) => sum + c.saldo, 0);
  banner.hidden = false;
  document.getElementById("saldo-banner-title").textContent =
    `${conSaldo.length} cliente${conSaldo.length === 1 ? "" : "s"} con saldo pendiente`;
  document.getElementById("saldo-banner-text").textContent = `Suman ${currency(total)} en total.`;
}

function renderClients() {
  const grid = document.getElementById("client-grid");
  const filtered = getFilteredClients();
  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="client-empty">No encontramos clientes con ese criterio.</p>`;
    return;
  }

  filtered.forEach((c) => {
    const card = document.createElement("article");
    card.className = "client-card";
    card.dataset.id = c.id;
    card.innerHTML = `
      <div class="client-head">
        <div>
          <a class="client-name" href="Cliente.html?id=${c.id}">${c.nombre}</a>
          <span class="client-dni">DNI: ${c.dni}</span>
        </div>
        <button type="button" class="client-menu-btn" aria-label="Acciones">
          <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6"></circle><circle cx="12" cy="12" r="1.6"></circle><circle cx="12" cy="19" r="1.6"></circle></svg>
        </button>
        <ul class="client-menu" hidden>
          <li data-action="ficha">Ver ficha</li>
          <li data-action="editar">Editar</li>
          <li data-action="eliminar" class="danger">Eliminar</li>
        </ul>
      </div>
      <div class="client-detail">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92z"></path></svg>
        ${c.telefono || "Sin teléfono"}
      </div>
      ${c.email ? `<div class="client-detail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z" opacity="0"></path><path d="M22 6 12 13 2 6"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>${c.email}</div>` : ""}
      ${c.direccion ? `<div class="client-detail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>${c.direccion}</div>` : ""}
      ${c.saldo > 0 ? `<span class="client-saldo-badge">Debe ${currency(c.saldo)}</span>` : ""}
    `;
    grid.appendChild(card);
  });
}

/* ---------- búsqueda ---------- */

document.getElementById("search-input").addEventListener("input", (e) => {
  currentSearch = e.target.value;
  renderClients();
});

document.getElementById("saldo-toggle").addEventListener("click", (event) => {
  const chip = event.target.closest(".status-chip");
  if (!chip) return;
  document.querySelectorAll("#saldo-toggle .status-chip").forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  currentFiltro = chip.dataset.filtro;
  renderClients();
});

/* ---------- modal: alta / edición ---------- */

const overlay = document.getElementById("client-overlay");
const form = document.getElementById("client-form");
const modalTitle = document.getElementById("client-modal-title");

function openModal(client) {
  form.reset();
  document.querySelectorAll("#client-form .field").forEach((f) => f.classList.remove("has-error"));

  if (client) {
    modalTitle.textContent = "Editar Cliente";
    document.getElementById("client-id").value = client.id;
    document.getElementById("client-nombre").value = client.nombre;
    document.getElementById("client-dni").value = client.dni;
    document.getElementById("client-telefono").value = client.telefono;
    document.getElementById("client-email").value = client.email || "";
    document.getElementById("client-direccion").value = client.direccion || "";
    document.getElementById("client-saldo").value = client.saldo || "";
  } else {
    modalTitle.textContent = "Nuevo Cliente";
    document.getElementById("client-id").value = "";
  }

  overlay.hidden = false;
  document.getElementById("client-nombre").focus();
}

function closeModal() {
  overlay.hidden = true;
}

document.getElementById("btn-nuevo-cliente").addEventListener("click", () => openModal(null));
document.getElementById("client-modal-close").addEventListener("click", closeModal);
document.getElementById("client-cancel").addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !overlay.hidden) closeModal();
});

/* ---------- guardar (crear o actualizar) ---------- */

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nombreInput = document.getElementById("client-nombre");
  const dniInput = document.getElementById("client-dni");
  const telefonoInput = document.getElementById("client-telefono");
  const saldoInput = document.getElementById("client-saldo");

  let isValid = true;
  [nombreInput, dniInput, telefonoInput].forEach((input) => {
    const empty = !input.value.trim();
    input.closest(".field").classList.toggle("has-error", empty);
    if (empty) isValid = false;
  });

  const saldoRaw = saldoInput.value.trim();
  const saldoNum = saldoRaw ? parseFloat(saldoRaw.replace(",", ".")) : 0;
  const saldoInvalido = saldoRaw !== "" && (isNaN(saldoNum) || saldoNum < 0);
  saldoInput.closest(".field").classList.toggle("has-error", saldoInvalido);
  if (saldoInvalido) isValid = false;

  if (!isValid) return;

  const id = document.getElementById("client-id").value;
  const payload = {
    id: id || `c${Date.now()}`,
    nombre: nombreInput.value.trim(),
    dni: dniInput.value.trim(),
    telefono: telefonoInput.value.trim(),
    email: document.getElementById("client-email").value.trim(),
    direccion: document.getElementById("client-direccion").value.trim(),
    saldo: saldoNum || 0,
  };

  if (id) {
    clients = clients.map((c) => (c.id === id ? payload : c));
  } else {
    clients.push(payload);
  }

  saveClients(clients);
  renderClients();
  renderSaldoBanner();
  closeModal();
});

/* ---------- menú de acciones por card (delegado) ---------- */

document.addEventListener("click", (event) => {
  const menuBtn = event.target.closest(".client-menu-btn");

  document.querySelectorAll(".client-menu").forEach((menu) => {
    if (!menuBtn || menu !== menuBtn.nextElementSibling) menu.hidden = true;
  });

  if (menuBtn) {
    menuBtn.nextElementSibling.hidden = !menuBtn.nextElementSibling.hidden;
    return;
  }

  const actionItem = event.target.closest(".client-menu li");
  if (!actionItem) return;

  const card = actionItem.closest(".client-card");
  const id = card.dataset.id;
  const client = clients.find((c) => c.id === id);

  if (actionItem.dataset.action === "ficha") {
    window.location.href = `Cliente.html?id=${id}`;
  } else if (actionItem.dataset.action === "editar") {
    openModal(client);
  } else if (actionItem.dataset.action === "eliminar") {
    if (confirm(`¿Eliminar a "${client.nombre}"? Esta acción no se puede deshacer.`)) {
      clients = clients.filter((c) => c.id !== id);
      saveClients(clients);
      renderClients();
      renderSaldoBanner();
    }
  }
  actionItem.closest(".client-menu").hidden = true;
});

/* ---------- primer render ---------- */

renderClients();
renderSaldoBanner();