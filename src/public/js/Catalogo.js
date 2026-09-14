/* ==========================================================
   LISTA DE PRECIOS / CATÁLOGO DE SERVICIOS
   Persistido en localStorage bajo STORAGE_KEY. Caja/Factura lee
   esta misma clave para el selector de "Servicio" del modal de
   Registrar Cobro. Reemplazá load/save por tu API real cuando
   la tengas.
   ========================================================== */

const STORAGE_KEY = "ulicel_catalogo";

const SEED_SERVICIOS = [
  { id: "s1", nombre: "Cambio de Display", categoria: "Pantallas", precio: 7800 },
  { id: "s2", nombre: "Cambio de Batería", categoria: "Batería", precio: 4200 },
  { id: "s3", nombre: "Reparación de Puerto de Carga", categoria: "Sistema Eléctrico", precio: 3500 },
  { id: "s4", nombre: "Recuperación de Datos", categoria: "Software", precio: 9800 },
  { id: "s5", nombre: "Mantenimiento Preventivo", categoria: "Mantenimiento", precio: 1250 },
  { id: "s6", nombre: "Limpieza de Inyectores", categoria: "Motor", precio: 3200 },
];

function loadServicios() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("No se pudo leer localStorage, usando datos de ejemplo.", e);
  }
  saveServicios(SEED_SERVICIOS);
  return SEED_SERVICIOS;
}

function saveServicios(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

let servicios = loadServicios();
let currentSearch = "";

const currency = (n) =>
  `$${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ---------- render ---------- */

function getFiltered() {
  const q = currentSearch.trim().toLowerCase();
  if (!q) return servicios;
  return servicios.filter(
    (s) => s.nombre.toLowerCase().includes(q) || s.categoria.toLowerCase().includes(q)
  );
}

function renderCategoriasDatalist() {
  const categorias = [...new Set(servicios.map((s) => s.categoria))];
  document.getElementById("cat-categoria-options").innerHTML = categorias
    .map((c) => `<option value="${c}">`)
    .join("");
}

function renderTable() {
  const filtered = getFiltered();
  const body = document.getElementById("cat-table-body");
  body.innerHTML = "";

  if (filtered.length === 0) {
    body.innerHTML = `<tr class="oa-empty"><td colspan="4">No encontramos servicios con ese criterio.</td></tr>`;
  } else {
    filtered.forEach((s) => {
      const tr = document.createElement("tr");
      tr.dataset.id = s.id;
      tr.innerHTML = `
        <td class="check-cell"><input type="checkbox" class="quote-check" data-id="${s.id}"></td>
        <td>${s.nombre}</td>
        <td><span class="servicio-categoria-tag">${s.categoria}</span></td>
        <td class="num">${currency(s.precio)}</td>
        <td class="acciones-cell admin-only">
          <button type="button" class="row-menu-btn" aria-label="Acciones">
            <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6"></circle><circle cx="12" cy="12" r="1.6"></circle><circle cx="12" cy="19" r="1.6"></circle></svg>
          </button>
          <ul class="row-menu" hidden>
            <li data-action="editar">Editar</li>
            <li data-action="eliminar" class="danger">Eliminar</li>
          </ul>
        </td>
      `;
      body.appendChild(tr);
    });
  }

  // mantiene marcados los que ya estaban seleccionados al re-renderizar (por búsqueda, etc.)
  document.querySelectorAll(".quote-check").forEach((chk) => {
    chk.checked = selectedIds.has(chk.dataset.id);
  });

  renderCategoriasDatalist();
}

document.getElementById("search-input").addEventListener("input", (e) => {
  currentSearch = e.target.value;
  renderTable();
});

/* ---------- modal: nuevo / editar servicio ---------- */

const overlay = document.getElementById("servicio-overlay");
const form = document.getElementById("servicio-form");
const modalTitle = document.getElementById("servicio-modal-title");

function openModal(servicio) {
  form.reset();
  document.querySelectorAll("#servicio-form .field").forEach((f) => f.classList.remove("has-error"));

  if (servicio) {
    modalTitle.textContent = "Editar Servicio";
    document.getElementById("servicio-id").value = servicio.id;
    document.getElementById("servicio-nombre").value = servicio.nombre;
    document.getElementById("servicio-categoria").value = servicio.categoria;
    document.getElementById("servicio-precio").value = servicio.precio;
  } else {
    modalTitle.textContent = "Nuevo Servicio";
    document.getElementById("servicio-id").value = "";
  }

  overlay.hidden = false;
  document.getElementById("servicio-nombre").focus();
}

function closeModal() {
  overlay.hidden = true;
}

document.getElementById("btn-nuevo-servicio").addEventListener("click", () => openModal(null));
document.getElementById("servicio-modal-close").addEventListener("click", closeModal);
document.getElementById("servicio-cancel").addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !overlay.hidden) closeModal();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nombreInput = document.getElementById("servicio-nombre");
  const categoriaInput = document.getElementById("servicio-categoria");
  const precioInput = document.getElementById("servicio-precio");
  const precioNum = parseFloat(precioInput.value.replace(",", "."));

  let isValid = true;
  [nombreInput, categoriaInput].forEach((input) => {
    const empty = !input.value.trim();
    input.closest(".field").classList.toggle("has-error", empty);
    if (empty) isValid = false;
  });
  const precioInvalido = isNaN(precioNum) || precioNum < 0;
  precioInput.closest(".field").classList.toggle("has-error", precioInvalido);
  if (precioInvalido) isValid = false;

  if (!isValid) return;

  const id = document.getElementById("servicio-id").value;
  const payload = {
    id: id || `s${Date.now()}`,
    nombre: nombreInput.value.trim(),
    categoria: categoriaInput.value.trim(),
    precio: precioNum,
  };

  if (id) {
    servicios = servicios.map((s) => (s.id === id ? payload : s));
  } else {
    servicios.push(payload);
  }

  saveServicios(servicios);
  renderTable();
  closeModal();
});

/* ---------- menú de acciones por fila (delegado) ---------- */

document.addEventListener("click", (event) => {
  const menuBtn = event.target.closest(".row-menu-btn");

  document.querySelectorAll(".row-menu").forEach((menu) => {
    if (!menuBtn || menu !== menuBtn.nextElementSibling) menu.hidden = true;
  });

  if (menuBtn) {
    menuBtn.nextElementSibling.hidden = !menuBtn.nextElementSibling.hidden;
    return;
  }

  const actionItem = event.target.closest(".row-menu li");
  if (!actionItem) return;

  const id = actionItem.closest("tr").dataset.id;
  const servicio = servicios.find((s) => s.id === id);

  if (actionItem.dataset.action === "editar") {
    openModal(servicio);
  } else if (actionItem.dataset.action === "eliminar") {
    if (confirm(`¿Eliminar "${servicio.nombre}" del catálogo?`)) {
      servicios = servicios.filter((s) => s.id !== id);
      saveServicios(servicios);
      renderTable();
    }
  }
  actionItem.closest(".row-menu").hidden = true;
});

/* ---------- primer render ---------- */

const selectedIds = new Set();

renderTable();

/* ==========================================================
   VISIBILIDAD POR ROL
   Solo Admin ve "Nuevo Servicio", "Importar desde Excel" y las
   Acciones (Editar/Eliminar) de cada fila. Recepción y Técnico
   ven la lista en modo lectura, con los checkboxes para armar
   un presupuesto. Usa la misma clave que "menu principal.js"
   para mantenerse en sync con el selector de rol del header.
   ========================================================== */

function applyCatalogoRole(role) {
  document.body.className = document.body.className.replace(/\brole-\S+/g, "").trim();
  document.body.classList.add(`role-${role}`);
}

function getStoredRole() {
  const stored = localStorage.getItem("ulicel_role");
  return ["admin", "tecnico", "recepcion"].includes(stored) ? stored : "admin";
}

applyCatalogoRole(getStoredRole());

const roleSwitcher = document.getElementById("role-switcher");
if (roleSwitcher) {
  roleSwitcher.addEventListener("change", (e) => applyCatalogoRole(e.target.value));
}

/* ==========================================================
   IMPORTAR DESDE EXCEL (solo Admin)
   Espera columnas Nombre / Categoría / Precio (no importa el
   orden ni mayúsculas). Si el nombre ya existe en el catálogo,
   actualiza el precio y la categoría; si no, lo agrega.
   ========================================================== */

const excelInput = document.getElementById("excel-input");

document.getElementById("btn-importar-excel").addEventListener("click", () => excelInput.click());

excelInput.addEventListener("change", () => {
  const file = excelInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const workbook = XLSX.read(e.target.result, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const filas = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      let agregados = 0;
      let actualizados = 0;

      filas.forEach((fila) => {
        const claves = Object.keys(fila);
        const keyNombre = claves.find((k) => /nombre|servicio/i.test(k));
        const keyCategoria = claves.find((k) => /categor/i.test(k));
        const keyPrecio = claves.find((k) => /precio/i.test(k));

        const nombre = keyNombre ? String(fila[keyNombre]).trim() : "";
        const categoria = keyCategoria ? String(fila[keyCategoria]).trim() : "Sin categoría";
        const precio = keyPrecio ? parseFloat(String(fila[keyPrecio]).replace(",", ".")) : NaN;

        if (!nombre || isNaN(precio)) return;

        const existente = servicios.find((s) => s.nombre.toLowerCase() === nombre.toLowerCase());
        if (existente) {
          existente.categoria = categoria;
          existente.precio = precio;
          actualizados += 1;
        } else {
          servicios.push({ id: `s${Date.now()}${Math.floor(Math.random() * 1000)}`, nombre, categoria, precio });
          agregados += 1;
        }
      });

      saveServicios(servicios);
      renderTable();
      alert(`Importación completa: ${agregados} servicio(s) nuevo(s), ${actualizados} actualizado(s).`);
    } catch (err) {
      console.error(err);
      alert("No se pudo leer el archivo. Verificá que sea un Excel (.xlsx) o CSV válido, con columnas Nombre, Categoría y Precio.");
    } finally {
      excelInput.value = "";
    }
  };
  reader.readAsArrayBuffer(file);
});

/* ==========================================================
   GENERAR PRESUPUESTO
   Junta los servicios tildados, arma un total, y abre
   Presupuesto.html con el detalle (vía localStorage, para no
   depender de una URL larga).
   ========================================================== */

const quoteBar = document.getElementById("quote-bar");

function updateQuoteBar() {
  const count = selectedIds.size;
  const total = [...selectedIds].reduce((sum, id) => {
    const s = servicios.find((sv) => sv.id === id);
    return sum + (s ? s.precio : 0);
  }, 0);

  quoteBar.hidden = count === 0;
  document.getElementById("quote-count").textContent = `${count} servicio${count === 1 ? "" : "s"} seleccionado${count === 1 ? "" : "s"}`;
  document.getElementById("quote-total").textContent = currency(total);
}

document.addEventListener("change", (event) => {
  const chk = event.target.closest(".quote-check");
  if (!chk) return;
  if (chk.checked) selectedIds.add(chk.dataset.id);
  else selectedIds.delete(chk.dataset.id);
  updateQuoteBar();
});

document.getElementById("btn-generar-presupuesto").addEventListener("click", () => {
  const items = [...selectedIds]
    .map((id) => servicios.find((s) => s.id === id))
    .filter(Boolean);

  if (items.length === 0) return;

  const presupuesto = {
    cliente: document.getElementById("quote-cliente").value.trim() || "Consumidor Final",
    fecha: new Date().toISOString().slice(0, 10),
    items,
  };

  localStorage.setItem("ulicel_presupuesto_actual", JSON.stringify(presupuesto));
  window.open("Presupuesto.html", "_blank");
});
