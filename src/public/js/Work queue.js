/* ==========================================================
   COLA DE TRABAJO DEL TÉCNICO — TABLERO POR ESTADO
   JOBS es el dataset de ejemplo. Reemplazalo por la respuesta
   real de tu API cuando la tengas (incluyendo el campo "status":
   "pendiente" | "progreso" | "entregada"): renderBoard() y el
   resto de la pantalla no necesitan cambios.
   ========================================================== */

const ICONS = {
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 3.9l.06.06A1.65 1.65 0 0 0 8.92 4.3H9a1.65 1.65 0 0 0 1-1.51V2.7a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
  thermo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>',
  printer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>',
  scan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><line x1="7" y1="12" x2="17" y2="12"></line></svg>',
  dock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="10" rx="1"></rect><line x1="8" y1="20" x2="16" y2="20"></line><line x1="12" y1="14" x2="12" y2="20"></line></svg>',
  laptop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="1"></rect><line x1="2" y1="20" x2="22" y2="20"></line></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2"></rect><line x1="11" y1="18" x2="13" y2="18"></line></svg>',
};

/* JOBS se guarda en localStorage bajo STORAGE_KEY: acá aterrizan las
   órdenes que se crean desde "Nueva Orden" (nueva orden.js escribe en
   la misma clave) y los cambios de estado que se hacen en este tablero.
   Reemplazá loadJobs()/saveJobs() por tu API real cuando la tengas. */
const STORAGE_KEY = "ulicel_ordenes";

const SEED_JOBS = [
  {
    id: "RO-8842-X",
    titulo: "Industrial Lathe Model Z",
    cliente: "Metalúrgica Del Norte S.A.",
    falla: "Fuga en sistema hidráulico primario",
    icon: "gear",
    fecha: "24 Oct, 2023",
    prioridad: "urgente",
    segundosRestantes: 2 * 60 + 45,
    status: "pendiente",
  },
  {
    id: "RO-9011-B",
    titulo: "Pneumatic Press Unit",
    cliente: "Industrias Halcón",
    falla: "Cortocircuito en placa de control",
    icon: "bolt",
    fecha: "25 Oct, 2023",
    prioridad: "critico",
    status: "pendiente",
  },
  {
    id: "RO-1205-H",
    titulo: "Conveyor Motor SM-40",
    cliente: "Envasadora San Martín",
    falla: "Sobrecalentamiento y vibración excesiva",
    icon: "thermo",
    fecha: "25 Oct, 2023",
    prioridad: "urgente",
    segundosRestantes: 5 * 60 + 12,
    status: "pendiente",
  },
  { id: "RO-5521-A", titulo: "Label Printer Industrial", cliente: "Distribuidora Ceres", icon: "printer", falla: "Atasco de papel recurrente en rodillo 3", fecha: "22 Oct, 2023", prioridad: "normal", status: "pendiente" },
  { id: "RO-4410-Q", titulo: "Scanner Handheld v2", cliente: "Logística Rioplatense", icon: "scan", falla: "Falla en calibración de sensor láser", fecha: "23 Oct, 2023", prioridad: "normal", status: "pendiente" },
  { id: "RO-3329-M", titulo: "Docking Station G7", cliente: "Estudio Contable Bravo", icon: "dock", falla: "Puerto USB-C dañado físicamente", fecha: "24 Oct, 2023", prioridad: "normal", status: "pendiente" },
  { id: "RO-1120-K", titulo: "Tech Laptop L40", cliente: "Colegio San Ignacio", icon: "laptop", falla: "Mantenimiento preventivo anual", fecha: "25 Oct, 2023", prioridad: "normal", status: "pendiente" },
];

function loadJobs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("No se pudo leer localStorage, usando datos de ejemplo.", e);
  }
  saveJobs(SEED_JOBS);
  return SEED_JOBS;
}

function saveJobs(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

let JOBS = loadJobs();

/* Datos de facturación por orden, usados por el modal de "Entrega y
   Finalización" (foto de egreso, cobro, PDF + garantía digital).
   Reemplazá esto por lo que te devuelva tu API cuando exista. */
const BILLING_INFO = {
  "RO-8842-X": { tipo: "Reparación Correctiva", manoDeObra: 3200, refaccionesCount: 2, refaccionesMonto: 5100, email: "tech@ulicel.com", garantiaMeses: 6 },
  "RO-9011-B": { tipo: "Reparación de Urgencia", manoDeObra: 2600, refaccionesCount: 1, refaccionesMonto: 3400, email: "tech@ulicel.com", garantiaMeses: 3 },
  "RO-1205-H": { tipo: "Mantenimiento Correctivo", manoDeObra: 1800, refaccionesCount: 2, refaccionesMonto: 2200, email: "tech@ulicel.com", garantiaMeses: 6 },
  "RO-5521-A": { tipo: "Mantenimiento Preventivo A2", manoDeObra: 1250, refaccionesCount: 3, refaccionesMonto: 4120, email: "tech@ulicel.com", garantiaMeses: 6 },
  "RO-4410-Q": { tipo: "Calibración de Sensores", manoDeObra: 950, refaccionesCount: 0, refaccionesMonto: 0, email: "tech@ulicel.com", garantiaMeses: 3 },
  "RO-3329-M": { tipo: "Reparación de Puerto", manoDeObra: 700, refaccionesCount: 1, refaccionesMonto: 1300, email: "tech@ulicel.com", garantiaMeses: 6 },
  "RO-1120-K": { tipo: "Mantenimiento Preventivo Anual", manoDeObra: 1250, refaccionesCount: 3, refaccionesMonto: 4120, email: "tech@ulicel.com", garantiaMeses: 12 },
};

// Fallback para órdenes que llegan desde "Nueva Orden" y todavía no
// tienen un presupuesto cargado: se completa a mano al finalizar.
const DEFAULT_BILLING = { tipo: "Reparación General", manoDeObra: 0, refaccionesCount: 0, refaccionesMonto: 0, email: "tech@ulicel.com", garantiaMeses: 6 };

/* ---------- helpers ---------- */

function formatMMSS(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function currencyFmt(n) {
  return `$${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* ---------- render del tablero completo ---------- */

const columns = {
  pendiente: document.getElementById("col-pendiente"),
  progreso: document.getElementById("col-progreso"),
  entregada: document.getElementById("col-entregada"),
};

function jobFlagHtml(job) {
  if (job.status === "entregada") return `<span class="job-flag is-done">✓ Entregada</span>`;
  if (job.status === "progreso") return `<span class="job-flag is-progress"><span class="dot"></span> En progreso</span>`;
  if (job.prioridad === "critico") return `<span class="job-flag">Crítico</span>`;
  if (job.prioridad === "urgente") {
    return `<span class="job-flag" data-countdown="${job.segundosRestantes}">${formatMMSS(job.segundosRestantes)} restantes</span>`;
  }
  return "";
}

function actionBtnHtml(job) {
  if (job.status === "pendiente") {
    return `<button type="button" class="start-btn" data-action="iniciar"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg> Iniciar Trabajo</button>`;
  }
  if (job.status === "progreso") {
    return `<button type="button" class="start-btn" data-action="finalizar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 8-8"></path><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"></path></svg> Finalizar Entrega</button>`;
  }
  return `<button type="button" class="start-btn" disabled>✓ Entregada</button>`;
}

function renderBoard() {
  Object.values(columns).forEach((col) => (col.innerHTML = ""));
  const counts = { pendiente: 0, progreso: 0, entregada: 0 };

  // pendientes: urgentes/críticos primero
  const sorted = [...JOBS].sort((a, b) => {
    const weight = { urgente: 0, critico: 0, normal: 1 };
    return (weight[a.prioridad] ?? 1) - (weight[b.prioridad] ?? 1);
  });

  sorted.forEach((job) => {
    counts[job.status] += 1;

    const card = document.createElement("article");
    card.className = `job-card status-${job.status} priority-${job.prioridad}`;
    card.dataset.id = job.id;

    card.innerHTML = `
      <div class="job-card-head">
        <span class="job-order-chip">#${job.id}</span>
        ${jobFlagHtml(job)}
      </div>
      <h3>${job.titulo}</h3>
      <div class="falla">${ICONS[job.icon] || ""}<span>${job.falla}</span></div>
      <div class="job-card-foot">
        <span class="job-date">Ingreso: ${job.fecha}</span>
        ${actionBtnHtml(job)}
      </div>
    `;

    columns[job.status].appendChild(card);
  });

  Object.entries(counts).forEach(([status, count]) => {
    document.getElementById(`count-${status}`).textContent = count;
    if (count === 0) {
      columns[status].innerHTML = `<p class="board-empty">Sin órdenes acá por ahora.</p>`;
    }
  });
}

renderBoard();

/* ---------- countdown en vivo ---------- */

setInterval(() => {
  document.querySelectorAll(".job-flag[data-countdown]").forEach((el) => {
    let remaining = parseInt(el.dataset.countdown, 10) - 1;
    if (remaining < 0) remaining = 0;
    el.dataset.countdown = remaining;
    el.textContent = remaining > 0 ? `${formatMMSS(remaining)} restantes` : "Vencido";
  });
}, 1000);

/* ---------- click en las cards: iniciar trabajo / abrir modal de finalización ---------- */

document.addEventListener("click", (event) => {
  const btn = event.target.closest(".start-btn");
  if (!btn || btn.disabled) return;

  const card = btn.closest(".job-card");
  const id = card?.dataset.id;
  const job = JOBS.find((j) => j.id === id);
  if (!job) return;

  if (btn.dataset.action === "iniciar") {
    // Placeholder: acá va tu PATCH real para marcar la orden "en progreso".
    // fetch(`/api/ordenes/${id}/iniciar`, { method: "PATCH" });
    job.status = "progreso";
    saveJobs(JOBS);
    renderBoard();
    return;
  }

  if (btn.dataset.action === "finalizar") {
    openFinalizeModal(id);
  }
});

/* ---------- modal "Entrega y Finalización" ---------- */

const overlay = document.getElementById("finalize-overlay");
let activeJobId = null;

function buildQrPattern() {
  // Patrón pseudo-QR (no es un QR real escaneable, es decorativo):
  // reemplazar por una librería de generación de QR cuando conectes
  // el link real a la garantía digital.
  let cells = "";
  for (let y = 0; y < 10; y += 1) {
    for (let x = 0; x < 10; x += 1) {
      const isFinder = (x < 3 && y < 3) || (x > 6 && y < 3) || (x < 3 && y > 6);
      const on = isFinder ? (x % 2 === 0 && y % 2 === 0) || (x === 1 && y === 1) : Math.random() > 0.55;
      if (on) cells += `<rect x="${x}" y="${y}" width="1" height="1"></rect>`;
    }
  }
  return cells;
}

function openFinalizeModal(id) {
  const job = JOBS.find((j) => j.id === id);
  const billing = BILLING_INFO[id] || DEFAULT_BILLING;
  if (!job) return;

  activeJobId = id;

  document.getElementById("modal-order-id").textContent = `#${id}`;
  document.getElementById("cobro-tipo").textContent = billing.tipo;
  document.getElementById("cobro-mano-obra").textContent = currencyFmt(billing.manoDeObra);
  document.getElementById("cobro-refacciones-label").textContent = `Refacciones (${billing.refaccionesCount})`;
  document.getElementById("cobro-refacciones").textContent = currencyFmt(billing.refaccionesMonto);
  document.getElementById("cobro-total").textContent = currencyFmt(billing.manoDeObra + billing.refaccionesMonto);
  document.getElementById("qr-email").textContent = billing.email;
  document.getElementById("qr-svg").innerHTML = buildQrPattern();

  resetModalPhoto();
  const confirmBtn = document.getElementById("modal-confirm");
  confirmBtn.disabled = false;
  confirmBtn.querySelector(".modal-confirm-label").textContent = "Cobrar, Guardar Foto y Generar PDF";
  confirmBtn.querySelector(".modal-confirm-spinner").hidden = true;
  confirmBtn.querySelector("svg").style.display = "";

  overlay.hidden = false;
}

function closeFinalizeModal() {
  overlay.hidden = true;
  activeJobId = null;
}

document.getElementById("modal-close").addEventListener("click", closeFinalizeModal);
document.getElementById("modal-cancel").addEventListener("click", closeFinalizeModal);
overlay.addEventListener("click", (event) => {
  if (event.target === overlay) closeFinalizeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !overlay.hidden) closeFinalizeModal();
});

/* ---------- foto de entrega dentro del modal ---------- */

const modalDropzone = document.getElementById("modal-dropzone");
const modalPhotoInput = document.getElementById("modal-photo-input");
const modalDropzoneEmpty = document.getElementById("modal-dropzone-empty");
const modalDropzonePreview = document.getElementById("modal-dropzone-preview");
const modalDropzoneRemove = document.getElementById("modal-dropzone-remove");

function resetModalPhoto() {
  modalPhotoInput.value = "";
  modalDropzonePreview.src = "";
  modalDropzonePreview.hidden = true;
  modalDropzoneEmpty.hidden = false;
  modalDropzoneRemove.hidden = true;
}

function showModalPhoto(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    modalDropzonePreview.src = e.target.result;
    modalDropzonePreview.hidden = false;
    modalDropzoneEmpty.hidden = true;
    modalDropzoneRemove.hidden = false;
  };
  reader.readAsDataURL(file);
}

modalDropzone.addEventListener("click", () => modalPhotoInput.click());
modalDropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    modalPhotoInput.click();
  }
});
modalPhotoInput.addEventListener("change", () => {
  if (modalPhotoInput.files[0]) showModalPhoto(modalPhotoInput.files[0]);
});
["dragover", "dragenter"].forEach((evt) =>
  modalDropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    modalDropzone.classList.add("drag-over");
  })
);
["dragleave", "drop"].forEach((evt) =>
  modalDropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    modalDropzone.classList.remove("drag-over");
  })
);
modalDropzone.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files[0];
  if (file) showModalPhoto(file);
});
modalDropzoneRemove.addEventListener("click", (e) => {
  e.stopPropagation();
  resetModalPhoto();
});

/* ---------- confirmar: cobrar + generar PDF + garantía digital ---------- */

document.getElementById("modal-confirm").addEventListener("click", () => {
  if (!activeJobId) return;

  const job = JOBS.find((j) => j.id === activeJobId);
  const billing = BILLING_INFO[activeJobId] || DEFAULT_BILLING;
  const confirmBtn = document.getElementById("modal-confirm");

  confirmBtn.disabled = true;
  confirmBtn.querySelector(".modal-confirm-label").textContent = "Generando...";
  confirmBtn.querySelector("svg").style.display = "none";
  confirmBtn.querySelector(".modal-confirm-spinner").hidden = false;

  // Placeholder: acá van tus llamadas reales (cobrar, subir la foto,
  // generar el comprobante fiscal y disparar el PDF de garantía).
  // fetch(`/api/ordenes/${activeJobId}/finalizar`, { method: "POST", body: ... });
  setTimeout(() => {
    // 1) Lo que importa de verdad: mover la orden a "Entregada" y
    //    guardarlo. Esto tiene que pasar sí o sí, pase lo que pase
    //    con la pestaña de la garantía de acá abajo.
    job.status = "entregada";
    saveJobs(JOBS);
    renderBoard();
    closeFinalizeModal();

    // 2) Intentar abrir la garantía digital en una pestaña nueva.
    //    Algunos navegadores (Brave, Firefox con bloqueo estricto,
    //    etc.) bloquean los popups que no se abren de forma síncrona
    //    dentro del click, y algunos hasta cortan la ejecución acá.
    //    Por eso va protegido y al final, para que si falla no se
    //    lleve puesto el paso 1.
    try {
      const vence = new Date();
      vence.setMonth(vence.getMonth() + billing.garantiaMeses);
      const venceISO = vence.toISOString().slice(0, 10);

      const params = new URLSearchParams({
        orden: activeJobId,
        equipo: job.titulo,
        cliente: job.cliente || "",
        reparacion: billing.tipo,
        vence: venceISO,
        tecnico: "Admin User",
      });

      const nuevaVentana = window.open(`Garantia.html?${params.toString()}`, "_blank");
      if (!nuevaVentana) {
        console.warn("El navegador bloqueó la pestaña de la garantía. La orden se marcó como entregada igual.");
      }
    } catch (e) {
      console.warn("No se pudo abrir la garantía digital en una pestaña nueva.", e);
    }
  }, 1100);
});