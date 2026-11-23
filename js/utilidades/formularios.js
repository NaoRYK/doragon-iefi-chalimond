export function marcarError(campo, mensaje) {
  campo.setCustomValidity(mensaje);
  campo.reportValidity();
  campo.addEventListener("input", () => campo.setCustomValidity(""), { once: true });
}
