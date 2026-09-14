const form = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const toggleBtn = document.getElementById("toggle-password");
const submitBtn = document.getElementById("submit-btn");
const formAlert = document.getElementById("form-alert");
const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");

// A dónde mandar al usuario después de un login exitoso.
// Ajustá esta ruta a donde tengas guardado tu menu principal.html real.
const REDIRECT_URL = "menu principal.html";

/* ---------- mostrar / ocultar contraseña ---------- */

toggleBtn.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";

  toggleBtn.querySelector(".icon-eye").hidden = isHidden;
  toggleBtn.querySelector(".icon-eye-off").hidden = !isHidden;
  toggleBtn.setAttribute("aria-pressed", String(isHidden));
  toggleBtn.setAttribute(
    "aria-label",
    isHidden ? "Ocultar contraseña" : "Mostrar contraseña"
  );
});

/* ---------- validación ---------- */

function setFieldError(input, hasError) {
  const field = input.closest(".field");
  field.classList.toggle("has-error", hasError);
  if (hasError) {
    field.classList.remove("shake");
    // reinicia la animación aunque el usuario reintente rápido
    void field.offsetWidth;
    field.classList.add("shake");
  }
}

function clearFieldError(input) {
  input.closest(".field").classList.remove("has-error");
}

[usernameInput, passwordInput].forEach((input) => {
  input.addEventListener("input", () => clearFieldError(input));
});

function validateForm() {
  let isValid = true;

  if (!usernameInput.value.trim()) {
    setFieldError(usernameInput, true);
    isValid = false;
  } else {
    setFieldError(usernameInput, false);
  }

  if (!passwordInput.value) {
    setFieldError(passwordInput, true);
    isValid = false;
  } else {
    setFieldError(passwordInput, false);
  }

  return isValid;
}

/* ---------- alerta general del formulario ---------- */

function showAlert(message, type) {
  formAlert.textContent = message;
  formAlert.classList.toggle("success", type === "success");
  formAlert.hidden = false;
}

function hideAlert() {
  formAlert.hidden = true;
}

/* ---------- estado de carga del botón ---------- */

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.querySelector(".btn-label").textContent = isLoading
    ? "Verificando..."
    : "Ingresar al Sistema";
  submitBtn.querySelector(".btn-arrow").hidden = isLoading;
  submitBtn.querySelector(".btn-spinner").hidden = !isLoading;
}

/* ---------- envío del formulario ---------- */

form.addEventListener("submit", (event) => {
  event.preventDefault();
  hideAlert();

  if (!validateForm()) {
    showAlert("Completá usuario y contraseña para continuar.", "error");
    return;
  }

  setLoading(true);
  form.submit();
});

/* ---------- estado del servidor (decorativo, listo para datos reales) ---------- */
// Si en algún momento consultás el estado real del servidor,
// alcanza con togglear la clase "online" y actualizar el texto:
// statusDot.classList.add("online");
// statusText.textContent = "Servidor: Norte-1";
