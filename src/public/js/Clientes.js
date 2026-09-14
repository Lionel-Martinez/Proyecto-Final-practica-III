const API_URL = "/api/clientes";

let clients = [];
let currentSearch = "";
let currentFiltro = "todos";

const currency = (n) =>
  `$${Number(n || 0).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function getCsrfToken() {
  return document.querySelector('meta[name="csrf-token"]')?.content || "";
}

/* ---------- API ---------- */

async function loadClients() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    clients = await response.json();

    renderClients();
    renderSaldoBanner();
  } catch (error) {
    console.error("No se pudieron cargar los clientes:", error);

    clients = [];

    const grid = document.getElementById("client-grid");
    grid.innerHTML = `
      <p class="client-empty">
        No se pudieron cargar los clientes.
        Verificá la conexión con el servidor.
      </p>
    `;
  }
}

async function createClient(payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-TOKEN": getCsrfToken(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `Error HTTP ${response.status}`
    );
  }

  return response.json();
}

async function updateClient(id, payload) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-TOKEN": getCsrfToken(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `Error HTTP ${response.status}`
    );
  }

  return response.json();
}

async function deleteClient(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "X-CSRF-TOKEN": getCsrfToken(),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `Error HTTP ${response.status}`
    );
  }

  return response.json();
}

/* ---------- render ---------- */

function getFilteredClients() {
  const q = currentSearch.trim().toLowerCase();

  return clients.filter((c) => {
    const matchesSearch =
      !q ||
      (c.nombre || "").toLowerCase().includes(q) ||
      (c.dni || "").toLowerCase().includes(q) ||
      (c.telefono || "").toLowerCase().includes(q);

    const matchesSaldo =
      currentFiltro === "todos" || Number(c.saldo || 0) > 0;

    return matchesSearch && matchesSaldo;
  });
}

function renderSaldoBanner() {
  const conSaldo = clients.filter(
    (c) => Number(c.saldo || 0) > 0
  );

  const banner = document.getElementById("saldo-banner");

  if (conSaldo.length === 0) {
    banner.hidden = true;
    return;
  }

  const total = conSaldo.reduce(
    (sum, c) => sum + Number(c.saldo || 0),
    0
  );

  banner.hidden = false;

  document.getElementById("saldo-banner-title").textContent =
    `${conSaldo.length} cliente${
      conSaldo.length === 1 ? "" : "s"
    } con saldo pendiente`;

  document.getElementById("saldo-banner-text").textContent =
    `Suman ${currency(total)} en total.`;
}

function renderClients() {
  const grid = document.getElementById("client-grid");
  const filtered = getFilteredClients();

  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML = `
      <p class="client-empty">
        No encontramos clientes con ese criterio.
      </p>
    `;
    return;
  }

  filtered.forEach((c) => {
    const card = document.createElement("article");

    card.className = "client-card";
    card.dataset.id = c.id;

    card.innerHTML = `
      <div class="client-head">
        <div>
          <a class="client-name" href="/clientes/${c.id}">
            ${c.nombre || "Sin nombre"}
          </a>
          <span class="client-dni">
            DNI: ${c.dni || "Sin DNI"}
          </span>
        </div>

        <button
          type="button"
          class="client-menu-btn"
          aria-label="Acciones"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.6"></circle>
            <circle cx="12" cy="12" r="1.6"></circle>
            <circle cx="12" cy="19" r="1.6"></circle>
          </svg>
        </button>

        <ul class="client-menu" hidden>
          <li data-action="ficha">Ver ficha</li>
          <li data-action="editar">Editar</li>
          <li data-action="eliminar" class="danger">Eliminar</li>
        </ul>
      </div>

      <div class="client-detail">
        <svg viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="1.8"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2
                   19.79 19.79 0 0 1-8.63-3.07
                   19.5 19.5 0 0 1-6-6
                   19.79 19.79 0 0 1-3.07-8.67
                   A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72
                   c.13.96.36 1.9.68 2.81
                   a2 2 0 0 1-.45 2.11L8.09 9.91
                   a16 16 0 0 0 6 6l1.27-1.27
                   a2 2 0 0 1 2.11-.45
                   c.91.32 1.85.55 2.81.68
                   A2 2 0 0 1 22 16.92z">
          </path>
        </svg>

        ${c.telefono || "Sin teléfono"}
      </div>

      ${
        c.email
          ? `
            <div class="client-detail">
              <svg viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.8"
                   stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 6 12 13 2 6"></path>
                <rect x="2" y="4" width="20"
                      height="16" rx="2"></rect>
              </svg>
              ${c.email}
            </div>
          `
          : ""
      }

      ${
        c.direccion
          ? `
            <div class="client-detail">
              <svg viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.8"
                   stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13
                         s-9-6-9-13a9 9 0 0 1 18 0z">
                </path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              ${c.direccion}
            </div>
          `
          : ""
      }

      ${
        Number(c.saldo || 0) > 0
          ? `
            <span class="client-saldo-badge">
              Debe ${currency(c.saldo)}
            </span>
          `
          : ""
      }
    `;

    grid.appendChild(card);
  });
}

/* ---------- búsqueda ---------- */

document
  .getElementById("search-input")
  .addEventListener("input", (event) => {
    currentSearch = event.target.value;
    renderClients();
  });

document
  .getElementById("saldo-toggle")
  .addEventListener("click", (event) => {
    const chip = event.target.closest(".status-chip");

    if (!chip) return;

    document
      .querySelectorAll("#saldo-toggle .status-chip")
      .forEach((c) => c.classList.remove("active"));

    chip.classList.add("active");

    currentFiltro = chip.dataset.filtro;

    renderClients();
  });

/* ---------- modal ---------- */

const overlay = document.getElementById("client-overlay");
const form = document.getElementById("client-form");
const modalTitle = document.getElementById("client-modal-title");

function openModal(client = null) {
  form.reset();

  document
    .querySelectorAll("#client-form .field")
    .forEach((field) => field.classList.remove("has-error"));

  if (client) {
    modalTitle.textContent = "Editar Cliente";

    document.getElementById("client-id").value = client.id;
    document.getElementById("client-nombre").value = client.nombre || "";
    document.getElementById("client-dni").value = client.dni || "";
    document.getElementById("client-telefono").value =
      client.telefono || "";
    document.getElementById("client-email").value =
      client.email || "";
    document.getElementById("client-direccion").value =
      client.direccion || "";
    document.getElementById("client-saldo").value =
      client.saldo || "";
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

document
  .getElementById("btn-nuevo-cliente")
  .addEventListener("click", () => openModal());

document
  .getElementById("client-modal-close")
  .addEventListener("click", closeModal);

document
  .getElementById("client-cancel")
  .addEventListener("click", closeModal);

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !overlay.hidden) {
    closeModal();
  }
});

/* ---------- guardar ---------- */

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nombreInput = document.getElementById("client-nombre");
  const dniInput = document.getElementById("client-dni");
  const telefonoInput = document.getElementById("client-telefono");
  const saldoInput = document.getElementById("client-saldo");

  let isValid = true;

  [nombreInput, dniInput, telefonoInput].forEach((input) => {
    const empty = !input.value.trim();

    input
      .closest(".field")
      .classList.toggle("has-error", empty);

    if (empty) {
      isValid = false;
    }
  });

  const saldoRaw = saldoInput.value.trim();
  const saldoNum = saldoRaw
    ? parseFloat(saldoRaw.replace(",", "."))
    : 0;

  const saldoInvalido =
    saldoRaw !== "" &&
    (Number.isNaN(saldoNum) || saldoNum < 0);

  saldoInput
    .closest(".field")
    .classList.toggle("has-error", saldoInvalido);

  if (saldoInvalido) {
    isValid = false;
  }

  if (!isValid) return;

  const id = document.getElementById("client-id").value;

  const payload = {
    nombre: nombreInput.value.trim(),
    dni: dniInput.value.trim() || null,
    telefono: telefonoInput.value.trim() || null,
    email:
      document.getElementById("client-email").value.trim() || null,
    direccion:
      document.getElementById("client-direccion").value.trim() || null,
    saldo: saldoNum || 0,
  };

  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  try {
    submitButton.disabled = true;
    submitButton.textContent = "Guardando...";

    let savedClient;

    if (id) {
      savedClient = await updateClient(id, payload);

      clients = clients.map((client) =>
        String(client.id) === String(id)
          ? savedClient
          : client
      );
    } else {
      savedClient = await createClient(payload);
      clients.unshift(savedClient);
    }

    renderClients();
    renderSaldoBanner();
    closeModal();
  } catch (error) {
    console.error("No se pudo guardar el cliente:", error);
    alert(`No se pudo guardar el cliente.\n\n${error.message}`);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
});

/* ---------- menú de acciones ---------- */

document.addEventListener("click", async (event) => {
  const menuBtn = event.target.closest(".client-menu-btn");

  document.querySelectorAll(".client-menu").forEach((menu) => {
    if (!menuBtn || menu !== menuBtn.nextElementSibling) {
      menu.hidden = true;
    }
  });

  if (menuBtn) {
    const menu = menuBtn.nextElementSibling;
    menu.hidden = !menu.hidden;
    return;
  }

  const actionItem = event.target.closest(".client-menu li");

  if (!actionItem) return;

  const card = actionItem.closest(".client-card");
  const id = card.dataset.id;

  const client = clients.find(
    (c) => String(c.id) === String(id)
  );

  if (!client) return;

  if (actionItem.dataset.action === "ficha") {
    window.location.href = `/clientes/${id}`;
  }

  if (actionItem.dataset.action === "editar") {
    openModal(client);
  }

  if (actionItem.dataset.action === "eliminar") {
    const confirmed = confirm(
      `¿Eliminar a "${client.nombre}"?\n\n` +
      "Esta acción no se puede deshacer."
    );

    if (!confirmed) return;

    try {
      await deleteClient(id);

      clients = clients.filter(
        (c) => String(c.id) !== String(id)
      );

      renderClients();
      renderSaldoBanner();
    } catch (error) {
      console.error("No se pudo eliminar el cliente:", error);
      alert(
        `No se pudo eliminar el cliente.\n\n${error.message}`
      );
    }
  }

  actionItem.closest(".client-menu").hidden = true;
});

/* ---------- carga inicial ---------- */

loadClients();
