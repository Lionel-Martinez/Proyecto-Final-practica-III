/* ==========================================================
   NUEVA ORDEN DE REPARACIÓN — WIZARD DE 4 PASOS
   ========================================================== */

const form = document.getElementById("order-form");

/* ---------- 1. subir / arrastrar foto con preview ---------- */

const dropzone = document.getElementById("dropzone");
const photoInput = document.getElementById("photo-input");
const dropzoneEmpty = document.getElementById("dropzone-empty");
const dropzonePreview = document.getElementById("dropzone-preview");
const dropzoneRemove = document.getElementById("dropzone-remove");

function showPhoto(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    dropzonePreview.src = e.target.result;
    dropzonePreview.hidden = false;
    dropzoneEmpty.hidden = true;
    dropzoneRemove.hidden = false;
    updateRailProgress();
  };
  reader.readAsDataURL(file);
}

dropzone.addEventListener("click", () => photoInput.click());
dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    photoInput.click();
  }
});

photoInput.addEventListener("change", () => {
  if (photoInput.files[0]) showPhoto(photoInput.files[0]);
});

["dragover", "dragenter"].forEach((evt) => {
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.add("drag-over");
  });
});

["dragleave", "drop"].forEach((evt) => {
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.remove("drag-over");
  });
});

dropzone.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files[0];
  if (file) showPhoto(file);
});

dropzoneRemove.addEventListener("click", (e) => {
  e.stopPropagation();
  photoInput.value = "";
  dropzonePreview.src = "";
  dropzonePreview.hidden = true;
  dropzoneEmpty.hidden = false;
  dropzoneRemove.hidden = true;
  updateRailProgress();
});

/* ---------- 2. contador de caracteres del problema reportado ---------- */

const problemaInput = document.getElementById("problema");
const charCount = document.getElementById("char-count");

problemaInput.addEventListener("input", () => {
  charCount.textContent = `${problemaInput.value.length} / 280`;
});

/* ---------- 3. sugerencias del "sistema inteligente" según tipo de equipo ---------- */
/* Placeholder de cara al usuario: reemplazar por una llamada real a tu
   backend / modelo cuando exista ("Ulicel AI" en la captura original). */

const AI_SUGGESTIONS = {
  celular: "Revisar puerto de carga tipo C y estado de batería.",
  notebook: "Verificar bisagras de pantalla y temperatura del disipador.",
  tablet: "Comprobar digitalizador táctil y conector de carga.",
  consola: "Testear lector óptico y ventilación del gabinete.",
  otro: "Cargá una descripción para que el equipo priorice el diagnóstico.",
};

const tipoSelect = document.getElementById("tipo");
const aiSuggestion = document.getElementById("ai-suggestion");

function updateAiSuggestion() {
  const tipo = tipoSelect.value;
  aiSuggestion.textContent = `Ulicel AI sugiere: "${AI_SUGGESTIONS[tipo] || AI_SUGGESTIONS.otro}"`;
}

tipoSelect.addEventListener("change", updateAiSuggestion);
updateAiSuggestion();

/* ---------- 4. checklist rápido ---------- */

const checklistInputs = document.querySelectorAll("#checklist input[type='checkbox']");
checklistInputs.forEach((input) => {
  input.addEventListener("change", updateRailProgress);
});

/* ==========================================================
   MOTOR DEL WIZARD: navegación entre pasos + progreso
   ========================================================== */

const TOTAL_STEPS = 4;
let currentStep = 1;

const railSteps = document.querySelectorAll(".rail-step");
const panels = document.querySelectorAll(".wizard-panel");
const contextCards = document.querySelectorAll(".context-card");
const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");
const btnBack = document.getElementById("btn-back");
const btnNext = document.getElementById("btn-next");
const btnSubmit = document.getElementById("btn-submit");

const STEP_FIELDS = {
  1: ["dni", "nombre", "contacto"],
  2: ["marca", "modelo", "problema"],
  3: [],
  4: [],
};

function goToStep(step) {
  currentStep = Math.min(Math.max(step, 1), TOTAL_STEPS);

  panels.forEach((panel) => {
    panel.classList.toggle("active", Number(panel.dataset.panel) === currentStep);
  });

  contextCards.forEach((card) => {
    card.hidden = Number(card.dataset.context) !== currentStep;
  });

  railSteps.forEach((btn) => {
    const step = Number(btn.dataset.step);
    btn.classList.toggle("active", step === currentStep);
  });

  progressFill.style.width = `${(currentStep / TOTAL_STEPS) * 100}%`;
  progressLabel.textContent = `Paso ${currentStep} de ${TOTAL_STEPS}`;

  btnBack.hidden = currentStep === 1;
  btnNext.hidden = currentStep === TOTAL_STEPS;
  btnSubmit.hidden = currentStep !== TOTAL_STEPS;

  if (currentStep === TOTAL_STEPS) fillReview();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function isStepComplete(step) {
  const fields = STEP_FIELDS[step] || [];
  if (fields.length === 0) return true;
  return fields.every((id) => document.getElementById(id).value.trim());
}

function updateRailProgress() {
  railSteps.forEach((btn) => {
    const step = Number(btn.dataset.step);
    if (step === currentStep) return;
    btn.classList.toggle("done", isStepComplete(step) && step < 4);
  });
}

[...STEP_FIELDS[1], ...STEP_FIELDS[2]].forEach((id) => {
  document.getElementById(id).addEventListener("input", updateRailProgress);
});
tipoSelect.addEventListener("change", updateRailProgress);

// click directo en el rail: navegación libre, sin bloquear por validación
railSteps.forEach((btn) => {
  btn.addEventListener("click", () => goToStep(Number(btn.dataset.step)));
});

btnNext.addEventListener("click", () => {
  if (!validateStep(currentStep)) return;
  goToStep(currentStep + 1);
});

btnBack.addEventListener("click", () => goToStep(currentStep - 1));

document.getElementById("btn-cancel").addEventListener("click", () => {
  window.location.href = "menu principal.html";
});

/* ---------- validación (por paso, y completa al enviar) ---------- */

const formAlert = document.getElementById("form-alert");

function setFieldError(id, hasError) {
  const input = document.getElementById(id);
  const field = input.closest(".field");
  if (!field) return;
  field.classList.toggle("has-error", hasError);
}

Object.values(STEP_FIELDS).flat().forEach((id) => {
  document.getElementById(id).addEventListener("input", () => setFieldError(id, false));
});

function validateStep(step) {
  const fields = STEP_FIELDS[step] || [];
  let isValid = true;
  let firstInvalid = null;

  fields.forEach((id) => {
    const input = document.getElementById(id);
    const empty = !input.value.trim();
    setFieldError(id, empty);
    if (empty) {
      isValid = false;
      if (!firstInvalid) firstInvalid = input;
    }
  });

  if (firstInvalid) firstInvalid.focus();
  if (!isValid) {
    formAlert.textContent = "Completá los campos obligatorios para continuar.";
    formAlert.classList.remove("success");
    formAlert.hidden = false;
  } else {
    formAlert.hidden = true;
  }

  return isValid;
}

/* ---------- paso 4: revisión ---------- */

function fillReview() {
  document.getElementById("review-nombre").textContent =
    document.getElementById("nombre").value.trim() || "—";
  document.getElementById("review-dni").textContent =
    `DNI: ${document.getElementById("dni").value.trim() || "—"}`;
  document.getElementById("review-contacto").textContent =
    document.getElementById("contacto").value.trim() || "Sin contacto";

  const marca = document.getElementById("marca").value.trim();
  const modelo = document.getElementById("modelo").value.trim();
  document.getElementById("review-equipo").textContent =
    marca || modelo ? `${marca} ${modelo}`.trim() : "—";
  document.getElementById("review-problema").textContent =
    document.getElementById("problema").value.trim() || "Sin descripción de falla";

  const checked = Array.from(checklistInputs)
    .filter((i) => i.checked)
    .map((i) => i.value);
  document.getElementById("review-checklist").textContent =
    checked.length ? checked.join(", ") : "Sin ítems marcados";

  document.getElementById("review-foto").textContent = dropzonePreview.hidden
    ? "Sin foto adjunta"
    : "Foto de ingreso adjunta ✓";
}

/* ---------- envío final ---------- */

const submitBtn = document.getElementById("btn-submit");

/* ---------- guardar la orden para que aparezca en Work Queue ---------- */
/* Misma clave que usa "Work queue.js": ahí es donde vive el tablero.
   Reemplazá esto por tu POST real a la API cuando exista. */

const ORDERS_STORAGE_KEY = "ulicel_ordenes";

const TYPE_ICON = {
  celular: "phone",
  notebook: "laptop",
  tablet: "dock",
  consola: "gear",
  otro: "printer",
};

function formatFechaCorta(date) {
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${date.getDate()} ${meses[date.getMonth()]}, ${date.getFullYear()}`;
}

function generarIdOrden() {
  const num = Math.floor(1000 + Math.random() * 9000);
  const letra = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `RO-${num}-${letra}`;
}

function guardarOrdenEnWorkQueue() {
  let ordenes = [];
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) ordenes = JSON.parse(raw);
  } catch (e) {
    console.warn("No se pudo leer las órdenes guardadas, se crea la lista de nuevo.", e);
  }

  const marca = document.getElementById("marca").value.trim();
  const modelo = document.getElementById("modelo").value.trim();
  const tipo = document.getElementById("tipo").value;

  const nuevaOrden = {
    id: generarIdOrden(),
    titulo: `${marca} ${modelo}`.trim() || "Equipo sin especificar",
    cliente: document.getElementById("nombre").value.trim() || "Cliente sin nombre",
    falla: document.getElementById("problema").value.trim() || "Sin descripción de falla",
    icon: TYPE_ICON[tipo] || "printer",
    fecha: formatFechaCorta(new Date()),
    prioridad: "normal",
    status: "pendiente",
  };

  ordenes.push(nuevaOrden);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(ordenes));
}

function validateAll() {
  let isValid = true;
  Object.entries(STEP_FIELDS).forEach(([step, fields]) => {
    fields.forEach((id) => {
      const input = document.getElementById(id);
      const empty = !input.value.trim();
      setFieldError(id, empty);
      if (empty) isValid = false;
    });
  });
  return isValid;
}

function showAlert(message, type) {
  formAlert.textContent = message;
  formAlert.classList.toggle("success", type === "success");
  formAlert.hidden = false;
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.querySelector(".btn-label").textContent = isLoading
    ? "Generando orden..."
    : "Registrar y Generar Orden";
  submitBtn.querySelector("svg").style.display = isLoading ? "none" : "";
  submitBtn.querySelector(".btn-spinner").hidden = !isLoading;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formAlert.hidden = true;

  if (!validateAll()) {
    showAlert("Faltan datos obligatorios. Revisá los pasos marcados en rojo.", "error");
    return;
  }

  setLoading(true);

  // Placeholder: acá va tu POST real a la API de órdenes. Ejemplo:
  // const res = await fetch("/api/ordenes", { method: "POST", body: new FormData(form) });
  setTimeout(() => {
    guardarOrdenEnWorkQueue();
    setLoading(false);
    showAlert("Orden registrada correctamente. Redirigiendo a Work Queue...", "success");
    setTimeout(() => {
      window.location.href = "Work queue.html";
    }, 900);
  }, 1200);
});

/* ---------- estado inicial ---------- */

goToStep(1);
updateRailProgress();