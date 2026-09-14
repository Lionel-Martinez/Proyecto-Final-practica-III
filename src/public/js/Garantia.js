/* ==========================================================
   GARANTÍA DIGITAL (ticket público para el cliente)
   Los datos llegan por query params desde el modal de "Entrega
   y Finalización" (Work queue.js). Si se abre este archivo
   suelto, sin params, se muestran valores de ejemplo.
   ========================================================== */

const params = new URLSearchParams(window.location.search);

const data = {
  orden: params.get("orden") || "UL-98234-SP",
  equipo: params.get("equipo") || 'MacBook Pro M2 14"',
  cliente: params.get("cliente") || "Cliente Ulicel",
  reparacion: params.get("reparacion") || "Cambio de Display",
  vence: params.get("vence") || "2026-07-09",
  tecnico: params.get("tecnico") || "Equipo Técnico Ulicel",
};

function formatDateDMY(isoDate) {
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}

/* ---------- pintar datos ---------- */

document.getElementById("order-id").textContent = data.orden;
document.getElementById("equipo").textContent = data.equipo;
document.getElementById("reparacion").textContent = data.reparacion;
document.getElementById("vence-date").textContent = formatDateDMY(data.vence);
document.getElementById("detail-tecnico").textContent = data.tecnico;
document.getElementById("detail-cliente").textContent = data.cliente;

/* ---------- estado de la garantía (sello activo / vencido) ---------- */

const venceDate = new Date(`${data.vence}T23:59:59`);
const isExpired = !isNaN(venceDate) && venceDate.getTime() < Date.now();

const stamp = document.getElementById("stamp");
if (isExpired) {
  stamp.classList.add("expired");
  stamp.innerHTML = "Garantía<br>Vencida";
}

/* ---------- detalles técnicos colapsables ---------- */

const detailsToggle = document.getElementById("details-toggle");
const detailsPanel = document.getElementById("details-panel");

detailsToggle.addEventListener("click", () => {
  const isOpen = detailsToggle.classList.toggle("open");
  detailsPanel.hidden = !isOpen;
});

/* ---------- botón de WhatsApp con mensaje precargado ---------- */

const WHATSAPP_NUMBER = "5493870000000"; // TODO: reemplazar por el número real de Ulicel

const mensaje = `Hola, quería consultar por mi orden ${data.orden} (${data.equipo}).`;
document.getElementById("whatsapp-btn").href =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;

/* ---------- código de barras decorativo + folio ---------- */
/* No es un código de barras real/escaneable: es una firma visual
   determinística a partir del número de orden, para que cada
   ticket se vea distinto pero siempre igual para la misma orden. */

function seedFromString(str) {
  let seed = 0;
  for (let i = 0; i < str.length; i += 1) seed = (seed * 31 + str.charCodeAt(i)) >>> 0;
  return seed;
}

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function renderBarcode(seedText) {
  const rand = mulberry32(seedFromString(seedText));
  const svg = document.getElementById("barcode");
  let x = 0;
  let bars = "";

  while (x < 200) {
    const width = 1 + Math.floor(rand() * 3);
    if (rand() > 0.45) {
      bars += `<rect x="${x}" y="0" width="${width}" height="34" fill="#14161a"></rect>`;
    }
    x += width;
  }

  svg.innerHTML = bars;
}

renderBarcode(data.orden);
document.getElementById("folio").textContent =
  `FOLIO ${data.orden.replace(/[^A-Z0-9]/gi, "")}-${data.vence.replace(/-/g, "")}`;
