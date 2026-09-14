/* ==========================================================
   ADMIN — configuración guardada en localStorage
   Igual que Clientes y Caja: mientras no haya backend, esto
   queda guardado en este navegador. Reemplazá las funciones
   load*/save* por tu API real cuando la tengas.
   ========================================================== */

/* ---------- datos del taller ---------- */

const TALLER_KEY = "ulicel_taller";

const TALLER_DEFAULT = {
  nombre: "Ulicel Tech",
  direccion: "Orán, Salta",
  telefono: "+54 9 387 555-0100",
  email: "contacto@ulicel.com",
};

function loadTaller() {
  try {
    const raw = localStorage.getItem(TALLER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("No se pudo leer localStorage, usando datos por defecto.", e);
  }
  return TALLER_DEFAULT;
}

function fillTallerForm() {
  const data = loadTaller();
  document.getElementById("taller-nombre").value = data.nombre;
  document.getElementById("taller-direccion").value = data.direccion;
  document.getElementById("taller-telefono").value = data.telefono;
  document.getElementById("taller-email").value = data.email;
}

document.getElementById("taller-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const data = {
    nombre: document.getElementById("taller-nombre").value.trim(),
    direccion: document.getElementById("taller-direccion").value.trim(),
    telefono: document.getElementById("taller-telefono").value.trim(),
    email: document.getElementById("taller-email").value.trim(),
  };

  localStorage.setItem(TALLER_KEY, JSON.stringify(data));

  const confirm = document.getElementById("taller-confirm");
  confirm.hidden = false;
  setTimeout(() => (confirm.hidden = true), 2000);
});

fillTallerForm();

/* ---------- usuarios y accesos ---------- */

const USERS_KEY = "ulicel_usuarios";

const USERS_SEED = [
  { id: "u1", nombre: "Admin User", rol: "admin" },
  { id: "u2", nombre: "Juan Pérez", rol: "tecnico" },
  { id: "u3", nombre: "Ana López", rol: "recepcion" },
];

const ROL_LABELS = { admin: "Admin", tecnico: "Técnico", recepcion: "Recepción" };

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("No se pudo leer localStorage, usando datos de ejemplo.", e);
  }
  saveUsers(USERS_SEED);
  return USERS_SEED;
}

function saveUsers(list) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}

let users = loadUsers();

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function renderUsers() {
  const list = document.getElementById("user-list");
  list.innerHTML = "";

  users.forEach((u) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="user-avatar">${initials(u.nombre)}</span>
      <span class="user-name">${u.nombre}</span>
      <span class="user-rol-pill rol-${u.rol}">${ROL_LABELS[u.rol]}</span>
      <button type="button" class="user-remove" data-id="${u.id}" aria-label="Quitar usuario">✕</button>
    `;
    list.appendChild(li);
  });
}

document.getElementById("user-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const nombreInput = document.getElementById("user-nombre");
  const nombre = nombreInput.value.trim();
  if (!nombre) return;

  users.push({ id: `u${Date.now()}`, nombre, rol: document.getElementById("user-rol").value });
  saveUsers(users);
  renderUsers();
  nombreInput.value = "";
  nombreInput.focus();
});

document.getElementById("user-list").addEventListener("click", (event) => {
  const btn = event.target.closest(".user-remove");
  if (!btn) return;
  users = users.filter((u) => u.id !== btn.dataset.id);
  saveUsers(users);
  renderUsers();
});

renderUsers();
