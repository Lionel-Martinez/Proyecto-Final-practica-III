/* ==========================================================
   INVENTARIO DE REPUESTOS — RAIL DE CATEGORÍAS + GRILLA DE BINS
   PARTS se guarda en localStorage bajo STORAGE_KEY: lo que
   agregues/edites/borres queda persistido en este navegador.
   Reemplazá loadParts()/saveParts() por tu API real cuando la
   tengas: el resto de la pantalla no necesita cambios.
   ========================================================== */

const LOW_STOCK_THRESHOLD = 10;
const GAUGE_MAX = 60; // capacidad de referencia para dibujar la barra de nivel

const ICONS = {
  motor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 3.9l.06.06A1.65 1.65 0 0 0 8.92 4.3H9a1.65 1.65 0 0 0 1-1.51V2.7a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
  freno: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="3"></circle></svg>',
  electrico: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
  inyeccion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="5" y1="5" x2="19" y2="19"></line><line x1="19" y1="5" x2="5" y2="19"></line></svg>',
  filtro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v3l-6 7v6l-4-2v-4L4 7z"></path></svg>',
};

const STORAGE_KEY = "ulicel_inventario";

const SEED_PARTS = [
  { sku: "FLTR-4029-X", nombre: "Filtro de Aceite Premium", categoria: "Motor / Lubricación", icon: "filtro", stock: 2, precio: 3200 },
  { sku: "BRK-9002-Z", nombre: "Kit de Frenos Cerámicos", categoria: "Seguridad / Frenado", icon: "freno", stock: 45, precio: 210 },
  { sku: "BATT-HD-44", nombre: "Batería Litio Heavy-Duty", categoria: "Sistema Eléctrico", icon: "electrico", stock: 12, precio: 480 },
  { sku: "INJ-G3-MK", nombre: "Inyector de Combustible G3", categoria: "Inyección", icon: "inyeccion", stock: 5, precio: 1650 },
  { sku: "SPK-GS-77", nombre: "Bujías G-Series", categoria: "Sistema Eléctrico", icon: "electrico", stock: 5, precio: 90 },
  { sku: "OIL-SEAL-12", nombre: "Sello de Aceite Reforzado", categoria: "Motor / Lubricación", icon: "motor", stock: 38, precio: 65 },
  { sku: "BRK-PAD-55", nombre: "Pastillas de Freno Std.", categoria: "Seguridad / Frenado", icon: "freno", stock: 60, precio: 55 },
  { sku: "FLTR-AIR-09", nombre: "Filtro de Aire Industrial", categoria: "Motor / Lubricación", icon: "filtro", stock: 22, precio: 40 },
  { sku: "ALT-220-D", nombre: "Alternador 220V", categoria: "Sistema Eléctrico", icon: "electrico", stock: 7, precio: 890 },
  { sku: "INJ-CLEAN-3", nombre: "Kit Limpieza de Inyectores", categoria: "Inyección", icon: "inyeccion", stock: 31, precio: 120 },
  { sku: "BRK-DISC-18", nombre: "Disco de Freno Ventilado", categoria: "Seguridad / Frenado", icon: "freno", stock: 16, precio: 340 },
  { sku: "MOT-BEAR-6", nombre: "Rodamiento de Motor", categoria: "Motor / Lubricación", icon: "motor", stock: 9, precio: 175 },
];

function loadParts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("No se pudo leer localStorage, usando datos de ejemplo.", e);
  }
  saveParts(SEED_PARTS);
  return SEED_PARTS;
}

function saveParts(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

let PARTS = loadParts();

const PAGE_SIZE = 6;

let currentPage = 1;
let currentEstado = "todos";
let currentCategoria = "todas";
let currentSearch = "";

const currency = (n) =>
  `$${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function getEstado(part) {
  return part.stock <= LOW_STOCK_THRESHOLD ? "agotandose" : "normal";
}

/* ---------- rail: valor total + alerta ---------- */

function renderRailStat() {
  const total = PARTS.reduce((sum, p) => sum + p.stock * p.precio, 0);
  document.getElementById("valor-total").textContent = currency(total);
}

function renderAlert() {
  const bajos = PARTS.filter((p) => getEstado(p) === "agotandose");
  document.getElementById("alert-text").textContent = bajos.length
    ? `${bajos.length} repuesto${bajos.length === 1 ? "" : "s"} por debajo del umbral (${LOW_STOCK_THRESHOLD} u.).`
    : "Todo el inventario está por encima del umbral de seguridad.";
  document.getElementById("alert-chips").innerHTML = bajos
    .map((p) => `<span class="alert-chip">${p.nombre} (${p.stock})</span>`)
    .join("");
}

/* ---------- rail: categorías ---------- */

function renderCategories() {
  const categories = [...new Set(PARTS.map((p) => p.categoria))];
  const list = document.getElementById("category-list");

  const items = [
    { key: "todas", label: "Todas", count: PARTS.length },
    ...categories.map((cat) => ({
      key: cat,
      label: cat,
      count: PARTS.filter((p) => p.categoria === cat).length,
    })),
  ];

  list.innerHTML = items
    .map(
      (item) => `
        <button type="button" class="category-item${item.key === currentCategoria ? " active" : ""}" data-categoria="${item.key}">
          <span>${item.label}</span>
          <span class="category-count">${item.count}</span>
        </button>
      `
    )
    .join("");

  list.querySelectorAll(".category-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCategoria = btn.dataset.categoria;
      currentPage = 1;
      renderCategories();
      renderGrid();
    });
  });

  const datalist = document.getElementById("categoria-options");
  if (datalist) {
    datalist.innerHTML = categories.map((cat) => `<option value="${cat}">`).join("");
  }
}

/* ---------- filtrado combinado ---------- */

function getFilteredParts() {
  return PARTS.filter((p) => {
    const matchesEstado = currentEstado === "todos" || getEstado(p) === currentEstado;
    const matchesCategoria = currentCategoria === "todas" || p.categoria === currentCategoria;
    const q = currentSearch.trim().toLowerCase();
    const matchesSearch =
      !q || p.nombre.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    return matchesEstado && matchesCategoria && matchesSearch;
  });
}

/* ---------- grilla de bins + paginación ---------- */

function renderGrid() {
  const filtered = getFilteredParts();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  currentPage = Math.min(currentPage, totalPages);

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const grid = document.getElementById("bin-grid");
  grid.innerHTML = "";

  if (pageItems.length === 0) {
    grid.innerHTML = `<p class="bin-empty">No encontramos repuestos con ese criterio.</p>`;
  } else {
    pageItems.forEach((p) => {
      const estado = getEstado(p);
      const pct = Math.min(100, Math.round((p.stock / GAUGE_MAX) * 100));
      const thresholdPct = Math.min(100, Math.round((LOW_STOCK_THRESHOLD / GAUGE_MAX) * 100));

      const card = document.createElement("article");
      card.className = "bin-card";
      card.dataset.sku = p.sku;
      card.innerHTML = `
        <div class="bin-head">
          <span class="bin-icon">${ICONS[p.icon] || ""}</span>
          <div class="bin-title">
            <strong>${p.nombre}</strong>
            <span class="bin-sku">SKU: ${p.sku}</span>
            <span class="bin-category">${p.categoria}</span>
          </div>
          <button type="button" class="bin-menu-btn" aria-label="Acciones">
            <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6"></circle><circle cx="12" cy="12" r="1.6"></circle><circle cx="12" cy="19" r="1.6"></circle></svg>
          </button>
          <ul class="bin-menu" hidden>
            <li data-action="editar">Editar</li>
            <li data-action="historial">Ver historial</li>
            <li data-action="eliminar" class="danger">Eliminar</li>
          </ul>
        </div>

        <div class="bin-gauge-head">
          <span class="bin-stock-value">${String(p.stock).padStart(2, "0")} unidades</span>
          <span class="bin-estado ${estado === "normal" ? "is-normal" : "is-bajo"}">${estado === "normal" ? "Normal" : "Agotándose"}</span>
        </div>
        <div class="bin-gauge-track">
          <div class="bin-gauge-fill ${estado === "agotandose" ? "is-bajo" : ""}" style="width:${pct}%"></div>
          <span class="bin-gauge-threshold" style="left:${thresholdPct}%" title="Umbral de reposición (${LOW_STOCK_THRESHOLD} u.)"></span>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  const showingFrom = filtered.length ? start + 1 : 0;
  const showingTo = Math.min(start + PAGE_SIZE, filtered.length);
  document.getElementById("inv-showing").textContent =
    `Mostrando ${showingFrom}-${showingTo} de ${filtered.length} repuestos`;

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const el = document.getElementById("pagination");
  el.innerHTML = "";

  const prev = document.createElement("button");
  prev.className = "page-btn";
  prev.disabled = currentPage === 1;
  prev.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
  prev.addEventListener("click", () => {
    currentPage -= 1;
    renderGrid();
  });
  el.appendChild(prev);

  for (let i = 1; i <= totalPages; i += 1) {
    const btn = document.createElement("button");
    btn.className = `page-btn${i === currentPage ? " active" : ""}`;
    btn.textContent = i;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderGrid();
    });
    el.appendChild(btn);
  }

  const next = document.createElement("button");
  next.className = "page-btn";
  next.disabled = currentPage === totalPages;
  next.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
  next.addEventListener("click", () => {
    currentPage += 1;
    renderGrid();
  });
  el.appendChild(next);
}

/* ---------- búsqueda ---------- */

document.getElementById("inv-search-input").addEventListener("input", (e) => {
  currentSearch = e.target.value;
  currentPage = 1;
  renderGrid();
});

/* ---------- filtro por estado (chips) ---------- */

document.getElementById("status-toggle").addEventListener("click", (event) => {
  const chip = event.target.closest(".status-chip");
  if (!chip) return;
  document.querySelectorAll(".status-chip").forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  currentEstado = chip.dataset.estado;
  currentPage = 1;
  renderGrid();
});

/* ---------- menú de acciones por card (delegado) ---------- */

document.addEventListener("click", (event) => {
  const menuBtn = event.target.closest(".bin-menu-btn");

  document.querySelectorAll(".bin-menu").forEach((menu) => {
    if (!menuBtn || menu !== menuBtn.nextElementSibling) menu.hidden = true;
  });

  if (menuBtn) {
    const menu = menuBtn.nextElementSibling;
    menu.hidden = !menu.hidden;
    return;
  }

  const actionItem = event.target.closest(".bin-menu li");
  if (actionItem) {
    const card = actionItem.closest(".bin-card");
    const sku = card.dataset.sku;
    const part = PARTS.find((p) => p.sku === sku);
    const action = actionItem.dataset.action;

    if (action === "editar") {
      openPartModal(part);
    } else if (action === "eliminar") {
      if (confirm(`¿Eliminar "${part.nombre}" del inventario? Esta acción no se puede deshacer.`)) {
        PARTS = PARTS.filter((p) => p.sku !== sku);
        saveParts(PARTS);
        renderRailStat();
        renderAlert();
        renderCategories();
        renderGrid();
      }
    } else if (action === "historial") {
      // TODO: reemplazar por la vista real de historial de movimientos del repuesto.
      console.log(`Ver historial de "${part.nombre}"`);
    }

    actionItem.closest(".bin-menu").hidden = true;
  }
});

/* ---------- exportar a CSV ---------- */

document.getElementById("export-btn").addEventListener("click", () => {
  const filtered = getFilteredParts();
  const header = ["SKU", "Repuesto", "Categoría", "Stock", "Estado", "Precio unitario"];
  const rows = filtered.map((p) => [
    p.sku,
    p.nombre,
    p.categoria,
    p.stock,
    getEstado(p) === "normal" ? "Normal" : "Agotándose",
    p.precio,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "inventario-ulicel.csv";
  a.click();
  URL.revokeObjectURL(url);
});

/* ---------- modal: nuevo / editar repuesto ---------- */

const partOverlay = document.getElementById("part-overlay");
const partForm = document.getElementById("part-form");
const partModalTitle = document.getElementById("part-modal-title");

function openPartModal(part) {
  partForm.reset();
  document.querySelectorAll("#part-form .field").forEach((f) => f.classList.remove("has-error"));

  if (part) {
    partModalTitle.textContent = "Editar Repuesto";
    document.getElementById("part-sku-original").value = part.sku;
    document.getElementById("part-nombre").value = part.nombre;
    document.getElementById("part-sku").value = part.sku;
    document.getElementById("part-categoria").value = part.categoria;
    document.getElementById("part-stock").value = part.stock;
    document.getElementById("part-precio").value = part.precio;
    document.getElementById("part-icon").value = part.icon;
  } else {
    partModalTitle.textContent = "Nuevo Repuesto";
    document.getElementById("part-sku-original").value = "";
  }

  partOverlay.hidden = false;
  document.getElementById("part-nombre").focus();
}

function closePartModal() {
  partOverlay.hidden = true;
}

document.getElementById("btn-nuevo-repuesto").addEventListener("click", () => openPartModal(null));
document.getElementById("part-modal-close").addEventListener("click", closePartModal);
document.getElementById("part-cancel").addEventListener("click", closePartModal);
partOverlay.addEventListener("click", (e) => {
  if (e.target === partOverlay) closePartModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !partOverlay.hidden) closePartModal();
});

partForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nombreInput = document.getElementById("part-nombre");
  const skuInput = document.getElementById("part-sku");
  const categoriaInput = document.getElementById("part-categoria");
  const stockInput = document.getElementById("part-stock");
  const precioInput = document.getElementById("part-precio");

  const stockNum = parseInt(stockInput.value, 10);
  const precioNum = parseFloat(precioInput.value.replace(",", "."));
  const originalSku = document.getElementById("part-sku-original").value;

  let isValid = true;
  const checks = [
    [nombreInput, !nombreInput.value.trim()],
    [skuInput, !skuInput.value.trim()],
    [categoriaInput, !categoriaInput.value.trim()],
    [stockInput, isNaN(stockNum) || stockNum < 0],
    [precioInput, isNaN(precioNum) || precioNum < 0],
  ];
  checks.forEach(([input, hasError]) => {
    input.closest(".field").classList.toggle("has-error", hasError);
    if (hasError) isValid = false;
  });
  if (!isValid) return;

  const payload = {
    sku: skuInput.value.trim(),
    nombre: nombreInput.value.trim(),
    categoria: categoriaInput.value.trim(),
    stock: stockNum,
    precio: precioNum,
    icon: document.getElementById("part-icon").value,
  };

  if (originalSku) {
    PARTS = PARTS.map((p) => (p.sku === originalSku ? payload : p));
  } else {
    PARTS.push(payload);
  }

  saveParts(PARTS);
  renderRailStat();
  renderAlert();
  renderCategories();
  renderGrid();
  closePartModal();
});

/* ---------- primer render ---------- */

renderRailStat();
renderAlert();
renderCategories();
renderGrid();