/* ==========================================================
   FICHA DE CLIENTE
   Lee el cliente de "ulicel_clientes" por ?id= en la URL, y cruza
   su historial mirando "ulicel_ordenes" y "ulicel_transacciones"
   por coincidencia de nombre (hoy no hay un id de cliente en esas
   otras claves; cuando haya backend, lo ideal es enlazarlas por id
   real en vez de por nombre).
   ========================================================== */

const CLIENTS_KEY = "ulicel_clientes";
const params = new URLSearchParams(window.location.search);
const clientId = params.get("id");

function loadClients() {
  try {
    return JSON.parse(localStorage.getItem(CLIENTS_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveClients(list) {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(list));
}

let clients = loadClients();
let client = clients.find((c) => c.id === clientId);

const currency = (n) =>
  `$${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

if (!client) {
  document.getElementById("not-found").hidden = false;
  document.getElementById("ficha-content").hidden = true;
} else {
  renderFicha();
}

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function renderFicha() {
  document.getElementById("breadcrumb-nombre").textContent = client.nombre;
  document.getElementById("ficha-avatar").textContent = initials(client.nombre);
  document.getElementById("ficha-nombre").textContent = client.nombre;
  document.getElementById("ficha-dni").textContent = `DNI: ${client.dni}`;
  document.getElementById("dato-telefono").textContent = client.telefono || "Sin teléfono";

  const emailRow = document.getElementById("dato-email-row");
  if (client.email) {
    document.getElementById("dato-email").textContent = client.email;
  } else {
    emailRow.hidden = true;
  }

  const direccionRow = document.getElementById("dato-direccion-row");
  if (client.direccion) {
    document.getElementById("dato-direccion").textContent = client.direccion;
  } else {
    direccionRow.hidden = true;
  }

  const saldoPill = document.getElementById("ficha-saldo-pill");
  if (client.saldo > 0) {
    saldoPill.hidden = false;
    saldoPill.textContent = `Debe ${currency(client.saldo)}`;
  }

  document.getElementById("resumen-saldo").textContent = currency(client.saldo || 0);

  renderOrdenes();
  renderCobros();
}

/* ---------- historial de reparaciones (Work Queue) ---------- */

function renderOrdenes() {
  let ordenes = [];
  try {
    ordenes = JSON.parse(localStorage.getItem("ulicel_ordenes") || "[]");
  } catch (e) {
    console.warn("No se pudieron leer las órdenes.", e);
  }

  const propias = ordenes.filter((o) => o.cliente === client.nombre);
  document.getElementById("resumen-reparaciones").textContent = propias.length;

  const list = document.getElementById("historial-ordenes");
  if (propias.length === 0) {
    list.innerHTML = `<li class="historial-empty">Todavía no hay reparaciones cargadas para este cliente.</li>`;
    return;
  }

  const estadoLabel = { pendiente: "Pendiente", progreso: "En Progreso", entregada: "Entregada" };

  list.innerHTML = propias
    .map(
      (o) => `
        <li>
          <span class="historial-fecha">${o.fecha}</span>
          <span class="historial-titulo">
            #${o.id} — ${o.titulo}
            <span class="historial-sub">${o.falla}</span>
          </span>
          <span class="estado-pill estado-${o.status}">${estadoLabel[o.status] || o.status}</span>
        </li>
      `
    )
    .join("");
}

/* ---------- historial de cobros (Caja/Factura) ---------- */

function renderCobros() {
  let transacciones = [];
  try {
    transacciones = JSON.parse(localStorage.getItem("ulicel_transacciones") || "[]");
  } catch (e) {
    console.warn("No se pudieron leer las transacciones.", e);
  }

  const propias = transacciones.filter((t) => t.cliente === client.nombre);
  const totalGastado = propias.reduce((sum, t) => sum + t.monto, 0);
  document.getElementById("resumen-gastado").textContent = currency(totalGastado);

  const list = document.getElementById("historial-cobros");
  if (propias.length === 0) {
    list.innerHTML = `<li class="historial-empty">Todavía no hay cobros registrados para este cliente.</li>`;
    return;
  }

  list.innerHTML = [...propias]
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
    .map((t) => {
      const [y, m, d] = t.fecha.split("-");
      return `
        <li>
          <span class="historial-fecha">${d}/${m}/${y}</span>
          <span class="historial-titulo">
            ${t.orden ? `Orden #${t.orden}` : "Cobro general"}
            <span class="historial-sub">${t.metodo}</span>
          </span>
          <span class="historial-monto">${currency(t.monto)}</span>
        </li>
      `;
    })
    .join("");
}

/* ---------- editar cliente (mismo modal que Clientes.html) ---------- */

if (client) {
  const overlay = document.getElementById("client-overlay");
  const form = document.getElementById("client-form");

  function openModal() {
    document.querySelectorAll("#client-form .field").forEach((f) => f.classList.remove("has-error"));
    document.getElementById("client-id").value = client.id;
    document.getElementById("client-nombre").value = client.nombre;
    document.getElementById("client-dni").value = client.dni;
    document.getElementById("client-telefono").value = client.telefono;
    document.getElementById("client-email").value = client.email || "";
    document.getElementById("client-direccion").value = client.direccion || "";
    document.getElementById("client-saldo").value = client.saldo || "";
    overlay.hidden = false;
  }

  function closeModal() {
    overlay.hidden = true;
  }

  document.getElementById("btn-editar").addEventListener("click", openModal);
  document.getElementById("client-modal-close").addEventListener("click", closeModal);
  document.getElementById("client-cancel").addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) closeModal();
  });

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

    client = {
      ...client,
      nombre: nombreInput.value.trim(),
      dni: dniInput.value.trim(),
      telefono: telefonoInput.value.trim(),
      email: document.getElementById("client-email").value.trim(),
      direccion: document.getElementById("client-direccion").value.trim(),
      saldo: saldoNum || 0,
    };

    clients = clients.map((c) => (c.id === client.id ? client : c));
    saveClients(clients);
    renderFicha();
    closeModal();
  });
}
