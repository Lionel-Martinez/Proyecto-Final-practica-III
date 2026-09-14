/* ==========================================================
   PRESUPUESTO
   Lee el detalle que "Catalogo.js" dejó en localStorage justo
   antes de abrir esta página (clave "ulicel_presupuesto_actual").
   Si se abre esta página suelta, sin ese dato, muestra un aviso.
   ========================================================== */

const currency = (n) =>
  `$${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function formatDateDMY(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

let presupuesto = null;
try {
  presupuesto = JSON.parse(localStorage.getItem("ulicel_presupuesto_actual") || "null");
} catch (e) {
  presupuesto = null;
}

if (!presupuesto || !presupuesto.items || presupuesto.items.length === 0) {
  document.getElementById("card").innerHTML = `
    <p style="text-align:center; color:#6b7280; padding: 2rem 0;">
      No hay ningún presupuesto para mostrar.<br>
      Generalo desde <a href="Catalogo.html">Lista de Precios</a>, marcando los servicios y apretando "Generar Presupuesto".
    </p>
  `;
} else {
  // datos del taller (si están cargados en Admin)
  let taller = { nombre: "Ulicel Tech", direccion: "", telefono: "" };
  try {
    const raw = localStorage.getItem("ulicel_taller");
    if (raw) taller = { ...taller, ...JSON.parse(raw) };
  } catch (e) {
    // sin datos guardados, seguimos con el nombre por defecto
  }

  document.getElementById("taller-nombre").textContent = taller.nombre;
  document.getElementById("taller-datos").textContent =
    [taller.direccion, taller.telefono].filter(Boolean).join(" · ") || "Servicio Técnico Especializado";

  document.getElementById("p-cliente").textContent = presupuesto.cliente;
  document.getElementById("p-fecha").textContent = formatDateDMY(presupuesto.fecha);

  const folio = `PRE-${presupuesto.fecha.replace(/-/g, "")}-${Math.floor(Math.random() * 900 + 100)}`;
  document.getElementById("doc-folio").textContent = folio;

  const tbody = document.getElementById("items-body");
  tbody.innerHTML = presupuesto.items
    .map((item) => `<tr><td>${item.nombre}</td><td class="num">${currency(item.precio)}</td></tr>`)
    .join("");

  const total = presupuesto.items.reduce((sum, i) => sum + i.precio, 0);
  document.getElementById("p-total").textContent = currency(total);

  document.getElementById("btn-imprimir").addEventListener("click", () => window.print());

  const lineas = presupuesto.items.map((i) => `• ${i.nombre}: ${currency(i.precio)}`).join("\n");
  const mensaje = `Hola ${presupuesto.cliente}, este es el presupuesto de ${taller.nombre}:\n\n${lineas}\n\nTotal: ${currency(total)}\n\nVálido por 7 días.`;
  document.getElementById("btn-whatsapp").href = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
}
