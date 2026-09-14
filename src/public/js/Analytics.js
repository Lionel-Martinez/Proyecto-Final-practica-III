/* ==========================================================
   DASHBOARD DE RENTABILIDAD
   Los datos hoy están hardcodeados en PERIODS. Reemplazá esto
   por la respuesta real de tu API (por período) cuando la
   tengas: render() y el resto de la pantalla no necesitan cambios.
   ========================================================== */

const PERIODS = {
  "2024-01": {
    label: "Enero 2024",
    tag: "Mes actual",
    ingresos: 425800,
    ingresosDelta: "+12.5%",
    costos: 182450,
    costosDelta: "+4.2%",
    ganancia: 243350,
    margen: 57.1,
    fallas: [
      { nombre: "Falla de Pantalla (LCD/Touch)", tickets: 142 },
      { nombre: "Cambio de Batería", tickets: 98 },
      { nombre: "Puerto de Carga", tickets: 74 },
      { nombre: "Daño por Agua", tickets: 42 },
      { nombre: "Software / Actualización", tickets: 18 },
    ],
    ordenes: [
      { id: "RO-8821", cliente: "Carlos Arrieta", servicio: "Recuperación Avanzada", ingreso: 12400, ganancia: 8200, estado: "entregado" },
      { id: "RO-8830", cliente: "Tech Corp S.A.", servicio: "Mantenimiento de Flota", ingreso: 45000, ganancia: 22500, estado: "proceso" },
      { id: "RO-8825", cliente: "Sonia Méndez", servicio: "Reemplazo OLED Pro", ingreso: 7800, ganancia: 3100, estado: "entregado" },
    ],
  },
  "2023-12": {
    label: "Diciembre 2023",
    tag: "Mes anterior",
    ingresos: 378600,
    ingresosDelta: "+6.8%",
    costos: 175100,
    costosDelta: "-1.5%",
    ganancia: 203500,
    margen: 53.8,
    fallas: [
      { nombre: "Falla de Pantalla (LCD/Touch)", tickets: 129 },
      { nombre: "Cambio de Batería", tickets: 87 },
      { nombre: "Puerto de Carga", tickets: 61 },
      { nombre: "Software / Actualización", tickets: 34 },
      { nombre: "Daño por Agua", tickets: 22 },
    ],
    ordenes: [
      { id: "RO-8719", cliente: "Tech Corp S.A.", servicio: "Mantenimiento de Flota", ingreso: 42000, ganancia: 19800, estado: "entregado" },
      { id: "RO-8714", cliente: "Estudio Lumen", servicio: "Recuperación de Datos", ingreso: 9800, ganancia: 5400, estado: "entregado" },
      { id: "RO-8710", cliente: "Marina Duarte", servicio: "Cambio de Batería Pro", ingreso: 6200, ganancia: 2600, estado: "entregado" },
    ],
  },
  "2023-11": {
    label: "Noviembre 2023",
    tag: "Hace 2 meses",
    ingresos: 341200,
    ingresosDelta: "+2.1%",
    costos: 168900,
    costosDelta: "+0.8%",
    ganancia: 172300,
    margen: 50.5,
    fallas: [
      { nombre: "Falla de Pantalla (LCD/Touch)", tickets: 118 },
      { nombre: "Cambio de Batería", tickets: 79 },
      { nombre: "Puerto de Carga", tickets: 55 },
      { nombre: "Daño por Agua", tickets: 31 },
      { nombre: "Software / Actualización", tickets: 20 },
    ],
    ordenes: [
      { id: "RO-8601", cliente: "Colegio San Ignacio", servicio: "Mantenimiento Preventivo", ingreso: 15200, ganancia: 6800, estado: "entregado" },
      { id: "RO-8594", cliente: "Distribuidora Ceres", servicio: "Calibración de Sensores", ingreso: 5400, ganancia: 2100, estado: "entregado" },
      { id: "RO-8588", cliente: "Logística Rioplatense", servicio: "Reparación de Puerto", ingreso: 4100, ganancia: 1700, estado: "proceso" },
    ],
  },
};

const currency = (n) =>
  `$${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

let currentPeriod = "2024-01";

/* ---------- rail de períodos ---------- */

function renderPeriodRail() {
  const list = document.getElementById("period-list");
  list.innerHTML = Object.entries(PERIODS)
    .map(
      ([key, data]) => `
        <button type="button" class="period-item${key === currentPeriod ? " active" : ""}" data-period="${key}">
          <strong>${data.label}</strong>
          <span>${data.tag}</span>
        </button>
      `
    )
    .join("");

  list.querySelectorAll(".period-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPeriod = btn.dataset.period;
      render(currentPeriod);
    });
  });
}

/* ---------- render principal ---------- */

function render(periodKey) {
  const data = PERIODS[periodKey];
  if (!data) return;

  document.querySelectorAll(".period-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.period === periodKey);
  });

  // barra de resultado (waterfall ganancia vs costos)
  const costosPct = +(100 - data.margen).toFixed(1);
  document.getElementById("bar-ganancia").style.width = `${data.margen}%`;
  document.getElementById("bar-costos").style.width = `${costosPct}%`;
  document.getElementById("result-margin").textContent = `Margen ${data.margen}%`;

  document.getElementById("kpi-ganancia").textContent = currency(data.ganancia);
  document.getElementById("kpi-ingresos").textContent = currency(data.ingresos);
  document.getElementById("kpi-costos").textContent = currency(data.costos);

  const ingresosDeltaEl = document.getElementById("kpi-ingresos-delta");
  ingresosDeltaEl.textContent = data.ingresosDelta;
  ingresosDeltaEl.className = `result-stat-delta ${data.ingresosDelta.startsWith("+") ? "kpi-delta-up" : "kpi-delta-down"}`;

  const costosDeltaEl = document.getElementById("kpi-costos-delta");
  const costosSube = data.costosDelta.startsWith("+");
  costosDeltaEl.textContent = data.costosDelta;
  costosDeltaEl.className = `result-stat-delta ${costosSube ? "kpi-delta-down" : "kpi-delta-up"}`;

  // ranking de fallas
  const rankingList = document.getElementById("ranking-list");
  rankingList.innerHTML = "";
  const maxTickets = Math.max(...data.fallas.map((f) => f.tickets));

  data.fallas.forEach((falla) => {
    const li = document.createElement("li");
    const pct = Math.round((falla.tickets / maxTickets) * 100);
    li.innerHTML = `
      <div class="ranking-row-head">
        <strong>${falla.nombre}</strong>
        <span>${falla.tickets} tickets</span>
      </div>
      <div class="ranking-bar-track">
        <div class="ranking-bar-fill" style="width:${pct}%"></div>
      </div>
    `;
    rankingList.appendChild(li);
  });

  // leaderboard de top órdenes (reemplaza donut + tabla)
  const leaderboard = document.getElementById("leaderboard");
  leaderboard.innerHTML = "";

  [...data.ordenes]
    .sort((a, b) => b.ganancia - a.ganancia)
    .forEach((orden, index) => {
      const estadoLabel = orden.estado === "entregado" ? "Entregado" : "En Proceso";
      const estadoClass = orden.estado === "entregado" ? "is-entregado" : "is-proceso";
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="lb-rank">${index + 1}</span>
        <div class="lb-info">
          <strong>${orden.cliente}</strong>
          <span>#${orden.id} · ${orden.servicio}</span>
        </div>
        <div class="lb-amounts">
          <span class="lb-ganancia">${currency(orden.ganancia)}</span>
          <span class="lb-estado ${estadoClass}">${estadoLabel}</span>
        </div>
      `;
      leaderboard.appendChild(li);
    });
}

renderPeriodRail();
render(currentPeriod);

/* ==========================================================
   SECCIÓN "HOY" — dato en vivo, no es parte de PERIODS.
   Cruza las órdenes guardadas por Work Queue ("ulicel_ordenes")
   con los cobros guardados por Caja/Factura ("ulicel_transacciones").
   Como ambas claves ya las llenan esas pantallas, esto se actualiza
   solo a medida que usás el resto del sistema.
   ========================================================== */

function renderHoy() {
  const hoyDate = new Date();
  const hoyISO = hoyDate.toISOString().slice(0, 10);
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const hoyCorta = `${hoyDate.getDate()} ${meses[hoyDate.getMonth()]}, ${hoyDate.getFullYear()}`;

  document.getElementById("hoy-fecha").textContent = hoyCorta;

  // trabajos de hoy: órdenes de Work Queue cargadas con fecha de hoy
  let ordenes = [];
  try {
    ordenes = JSON.parse(localStorage.getItem("ulicel_ordenes") || "[]");
  } catch (e) {
    console.warn("No se pudieron leer las órdenes de Work Queue.", e);
  }
  const trabajosHoy = ordenes.filter((o) => o.fecha === hoyCorta).length;
  document.getElementById("hoy-trabajos").textContent = trabajosHoy;

  // costo promedio: cobros de Caja/Factura registrados hoy
  let transacciones = [];
  try {
    transacciones = JSON.parse(localStorage.getItem("ulicel_transacciones") || "[]");
  } catch (e) {
    console.warn("No se pudieron leer las transacciones de Caja/Factura.", e);
  }
  const txHoy = transacciones.filter((t) => t.fecha === hoyISO);
  const promedio = txHoy.length
    ? txHoy.reduce((sum, t) => sum + t.monto, 0) / txHoy.length
    : 0;
  document.getElementById("hoy-costo-promedio").textContent = currency(promedio);
}

renderHoy();

/* ==========================================================
   REPORTE MENSUAL EN PDF
   Usa jsPDF (cargado desde CDN en el <head>) para armar un PDF
   real, descargable, con los datos del período que esté activo
   en el rail de la izquierda. Corre 100% en el navegador, no
   necesita servidor.
   ========================================================== */

function getTallerInfo() {
  try {
    const raw = localStorage.getItem("ulicel_taller");
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // sin datos de taller guardados, seguimos con el nombre por defecto
  }
  return { nombre: "Ulicel Tech", direccion: "", telefono: "", email: "" };
}

function generarReportePDF() {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    alert("No se pudo cargar la librería de PDF. Revisá tu conexión e intentá de nuevo.");
    return;
  }

  const data = PERIODS[currentPeriod];
  const taller = getTallerInfo();
  const doc = new jsPDF();
  let y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(taller.nombre || "Ulicel Tech", 14, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  y += 7;
  doc.text(`Reporte de Rentabilidad — ${data.label}`, 14, y);
  doc.setTextColor(0);

  y += 12;
  doc.setDrawColor(220);
  doc.line(14, y, 196, y);

  // KPIs
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Resumen del período", 14, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const kpis = [
    ["Ingresos", currency(data.ingresos)],
    ["Costos", currency(data.costos)],
    ["Ganancia Real", currency(data.ganancia)],
    ["Margen", `${data.margen}%`],
  ];
  kpis.forEach(([label, value], i) => {
    const rowY = y + 8 + i * 7;
    doc.text(label, 14, rowY);
    doc.text(value, 80, rowY);
  });

  // ranking de fallas
  y += 8 + kpis.length * 7 + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Ranking de Fallas Frecuentes", 14, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  data.fallas.forEach((f, i) => {
    const rowY = y + 8 + i * 7;
    doc.text(`${i + 1}. ${f.nombre}`, 14, rowY);
    doc.text(`${f.tickets} tickets`, 160, rowY);
  });

  // top órdenes
  y += 8 + data.fallas.length * 7 + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Top Órdenes del Período", 14, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  [...data.ordenes]
    .sort((a, b) => b.ganancia - a.ganancia)
    .forEach((o, i) => {
      const rowY = y + 8 + i * 7;
      doc.text(`#${o.id} — ${o.cliente}`, 14, rowY);
      doc.text(currency(o.ganancia), 160, rowY);
    });

  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    `Generado el ${new Date().toLocaleDateString("es-AR")} por Ulicel Service Cloud`,
    14,
    285
  );

  const nombreArchivo = `reporte-${currentPeriod}.pdf`;
  doc.save(nombreArchivo);
}

document.getElementById("btn-pdf").addEventListener("click", generarReportePDF);