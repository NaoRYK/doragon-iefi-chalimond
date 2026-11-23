function obtenerContenedor() {
  let contenedor = document.querySelector("#avisos");

  if (!contenedor) {
    contenedor = document.createElement("div");
    contenedor.id = "avisos";
    contenedor.className = "avisos";
    contenedor.setAttribute("role", "status");
    document.body.append(contenedor);
  }

  return contenedor;
}

export function prepararAvisos() {
  obtenerContenedor();
}

export function mostrarAviso(mensaje, tipo = "ok") {
  const aviso = document.createElement("p");

  aviso.className = "aviso-flotante " + tipo;
  aviso.textContent = mensaje;
  obtenerContenedor().append(aviso);

  setTimeout(() => aviso.remove(), 5000);
}
