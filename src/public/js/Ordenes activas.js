/* ==========================================================
   ÓRDENES ACTIVAS
   ORDERS es el dataset de ejemplo (mismas órdenes que ves en
   Work Queue, pero acá en formato tabla general). Reemplazalo
   por la respuesta real de tu API cuando la tengas: el resto
   de la pantalla no necesita cambios.
   ========================================================== */

const ORDERS = [
  { id: "RO-8842-X", cliente: "Metalúrgica Del Norte S.A.", equipo: "Industrial Lathe Model Z", tecnico: "Juan Pérez", estado: "progreso", fecha: "24 Oct, 2023" },
  { id: "RO-9011-B", cliente: "Industrias Halcón", equipo: "Pneumatic Press Unit", tecnico: "Sin asignar", estado: "pendiente", fecha: "25 Oct, 2023" },
  { id: "RO-1205-H", cliente: "Envasadora San Martín", equipo: "Conveyor Motor SM-40", tecnico: "Sin asignar", estado: "pendiente", fecha: "25 Oct, 2023" },
  { id: "RO-5521-A", cliente: "Distribuidora Ceres", equipo: "Label Printer Industrial", tecnico: "Sin asignar", estado: "pendiente", fecha: "22 Oct, 2023" },
  { id: "RO-4410-Q", cliente: "Logística Rioplatense", equipo: "Scanner Handheld v2", tecnico: "Sin asignar", estado: "pendiente", fecha: "23 Oct, 2023" },
  { id: "RO-3329-M", cliente: "Estudio Contable Bravo", equipo: "Docking Station G7", tecnico: "Sin asignar", estado: "pendiente", fecha: "24 Oct, 2023" },
  { id: "RO-1120-K", cliente: "Colegio San Ignacio", equipo: "Tech Laptop L40", tecnico: "Sin asignar", estado: "pendiente", fecha: "25 Oct, 2023" },
];

let currentEstado = "todos";
let currentSearch = "";

function getFiltered() {
  const q = currentSearch.trim().toLowerCase();
  return ORDERS.filter((o) => {
    const matchesEstado = currentEstado === "todos" || o.estado === currentEstado;
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.cliente.toLowerCase().includes(q) ||
      o.equipo.toLowerCase().includes(q);
    return matchesEstado && matchesSearch;
  });
}

function render() {
  const filtered = getFiltered();
  const body = document.getElementById("oa-table-body");
  body.innerHTML = "";

  if (filtered.length === 0) {
    body.innerHTML = `<tr class="oa-empty"><td colspan="6">No encontramos órdenes con ese criterio.</td></tr>`;
  } else {
    filtered.forEach((o) => {
      const estadoLabel = o.estado === "pendiente" ? "Pendiente" : "En Progreso";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="oa-order-chip">#${o.id}</td>
        <td>${o.cliente}</td>
        <td>${o.equipo}</td>
        <td>${o.tecnico}</td>
        <td><span class="estado-pill estado-${o.estado}"><span class="dot"></span>${estadoLabel}</span></td>
        <td>${o.fecha}</td>
      `;
      body.appendChild(tr);
    });
  }

  document.getElementById("oa-showing").textContent =
    `${filtered.length} orden${filtered.length === 1 ? "" : "es"}`;
}

document.getElementById("search-input").addEventListener("input", (e) => {
  currentSearch = e.target.value;
  render();
});

document.getElementById("status-toggle").addEventListener("click", (event) => {
  const chip = event.target.closest(".status-chip");
  if (!chip) return;
  document.querySelectorAll(".status-chip").forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  currentEstado = chip.dataset.estado;
  render();
});

render();
