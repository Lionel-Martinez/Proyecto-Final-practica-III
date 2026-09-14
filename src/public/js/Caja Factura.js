/* ==========================================================
   CAJA / FACTURA — guardado real en localStorage
   Igual que Clientes: mientras no haya backend, cada cobro que
   registrás queda guardado en este navegador. Reemplazá
   loadTx()/saveTx() por tu API real cuando la tengas.
   ========================================================== */

const STORAGE_KEY = "ulicel_transacciones";

const SEED_TX = [
  { id: "t1", fecha: new Date().toISOString().slice(0, 10), cliente: "Carlos Arrieta", orden: "RO-8821", metodo: "Transferencia", monto: 12400 },
  { id: "t2", fecha: new Date().toISOString().slice(0, 10), cliente: "Sonia Méndez", orden: "RO-8825", metodo: "Efectivo", monto: 7800 },
  { id: "t3", fecha: new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10), cliente: "Tech Corp S.A.", orden: "RO-8830", metodo: "Transferencia", monto: 45000 },
];

function loadTx() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("No se pudo leer localStorage, usando datos de ejemplo.", e);
  }
  saveTx(SEED_TX);
  return SEED_TX;
}

function saveTx(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

let transactions = loadTx();
let currentSearch = "";

const currency = (n) =>
  `$${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ---------- stats ---------- */

function renderStats() {
  const today = new Date().toISOString().slice(0, 10);
  const thisMonth = today.slice(0, 7);

  const totalHoy = transactions
    .filter((t) => t.fecha === today)
    .reduce((sum, t) => sum + t.monto, 0);

  const totalMes = transactions
    .filter((t) => t.fecha.slice(0, 7) === thisMonth)
    .reduce((sum, t) => sum + t.monto, 0);

  document.getElementById("stat-hoy").textContent = currency(totalHoy);
  document.getElementById("stat-mes").textContent = currency(totalMes);
  document.getElementById("stat-count").textContent = transactions.length;
}

/* ---------- tabla ---------- */

function getFiltered() {
  const q = currentSearch.trim().toLowerCase();
  const sorted = [...transactions].sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  if (!q) return sorted;
  return sorted.filter(
    (t) => t.cliente.toLowerCase().includes(q) || (t.orden || "").toLowerCase().includes(q)
  );
}

function formatDateDMY(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function renderTable() {
  const filtered = getFiltered();
  const body = document.getElementById("tx-table-body");
  body.innerHTML = "";

  if (filtered.length === 0) {
    body.innerHTML = `<tr class="oa-empty"><td colspan="5">No encontramos cobros con ese criterio.</td></tr>`;
  } else {
    filtered.forEach((t) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${formatDateDMY(t.fecha)}</td>
        <td>${t.cliente}</td>
        <td>${t.orden ? `#${t.orden}` : "—"}</td>
        <td>${t.metodo}</td>
        <td class="num">${currency(t.monto)}</td>
      `;
      body.appendChild(tr);
    });
  }

  renderMetodos(filtered);
}

/* ---------- distribución por método de pago (sobre lo filtrado) ---------- */

function renderMetodos(filtered) {
  const list = document.getElementById("metodos-list");
  const total = filtered.reduce((sum, t) => sum + t.monto, 0);

  if (filtered.length === 0 || total === 0) {
    list.innerHTML = `<p class="metodos-empty">Sin cobros para mostrar todavía.</p>`;
    return;
  }

  const porMetodo = {};
  filtered.forEach((t) => {
    porMetodo[t.metodo] = (porMetodo[t.metodo] || 0) + t.monto;
  });

  const filas = Object.entries(porMetodo).sort((a, b) => b[1] - a[1]);

  list.innerHTML = filas
    .map(([metodo, monto]) => {
      const pct = Math.round((monto / total) * 100);
      return `
        <li>
          <div class="metodo-row-head">
            <strong>${metodo}</strong>
            <span>${pct}%</span>
          </div>
          <div class="metodo-bar-track">
            <div class="metodo-bar-fill" style="width:${pct}%"></div>
          </div>
        </li>
      `;
    })
    .join("");
}

document.getElementById("search-input").addEventListener("input", (e) => {
  currentSearch = e.target.value;
  renderTable();
});

/* ---------- modal: registrar cobro ---------- */

const overlay = document.getElementById("tx-overlay");
const form = document.getElementById("tx-form");

/* ---------- selector de servicio (desde el catálogo de precios) ---------- */

function loadCatalogo() {
  try {
    return JSON.parse(localStorage.getItem("ulicel_catalogo") || "[]");
  } catch (e) {
    return [];
  }
}

function renderServicioSelect() {
  const catalogo = loadCatalogo();
  const select = document.getElementById("tx-servicio");
  select.innerHTML =
    `<option value="">— Elegir del catálogo —</option>` +
    catalogo.map((s) => `<option value="${s.id}" data-precio="${s.precio}" data-nombre="${s.nombre}">${s.nombre} (${currency(s.precio)})</option>`).join("");
}

document.getElementById("tx-servicio").addEventListener("change", (event) => {
  const opt = event.target.selectedOptions[0];
  if (opt && opt.dataset.precio) {
    document.getElementById("tx-monto").value = opt.dataset.precio;
    document.getElementById("tx-monto").closest(".field").classList.remove("has-error");
  }
});

function openModal() {
  form.reset();
  document.querySelectorAll("#tx-form .field").forEach((f) => f.classList.remove("has-error"));
  renderServicioSelect();
  overlay.hidden = false;
  document.getElementById("tx-cliente").focus();
}

function closeModal() {
  overlay.hidden = true;
}

document.getElementById("btn-registrar-cobro").addEventListener("click", openModal);
document.getElementById("tx-modal-close").addEventListener("click", closeModal);
document.getElementById("tx-cancel").addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !overlay.hidden) closeModal();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const clienteInput = document.getElementById("tx-cliente");
  const montoInput = document.getElementById("tx-monto");
  const montoNum = parseFloat(montoInput.value.replace(",", "."));

  let isValid = true;
  const clienteEmpty = !clienteInput.value.trim();
  clienteInput.closest(".field").classList.toggle("has-error", clienteEmpty);
  if (clienteEmpty) isValid = false;

  const montoInvalido = isNaN(montoNum) || montoNum <= 0;
  montoInput.closest(".field").classList.toggle("has-error", montoInvalido);
  if (montoInvalido) isValid = false;

  if (!isValid) return;

  transactions.push({
    id: `t${Date.now()}`,
    fecha: new Date().toISOString().slice(0, 10),
    cliente: clienteInput.value.trim(),
    orden: document.getElementById("tx-orden").value.trim(),
    metodo: document.getElementById("tx-metodo").value,
    monto: montoNum,
  });

  saveTx(transactions);
  renderStats();
  renderTable();
  closeModal();
});

/* ---------- primer render ---------- */

renderStats();
renderTable();