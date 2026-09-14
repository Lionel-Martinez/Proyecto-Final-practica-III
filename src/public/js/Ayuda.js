/* ==========================================================
   AYUDA
   El botón de WhatsApp usa el teléfono cargado en Admin
   ("ulicel_taller") si existe; si no, cae a un número de
   ejemplo. Actualizalo desde Admin > Datos del Taller.
   ========================================================== */

function soloNumeros(str) {
  return (str || "").replace(/[^0-9]/g, "");
}

let telefono = "5493870000000"; // TODO: reemplazar por el número real de soporte
try {
  const taller = JSON.parse(localStorage.getItem("ulicel_taller") || "null");
  if (taller && taller.telefono) {
    const limpio = soloNumeros(taller.telefono);
    if (limpio) telefono = limpio;
  }
} catch (e) {
  // sin datos de taller guardados, seguimos con el número por defecto
}

const mensaje = "Hola, necesito ayuda con el sistema de Ulicel Tech.";
document.getElementById("soporte-whatsapp").href =
  `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
