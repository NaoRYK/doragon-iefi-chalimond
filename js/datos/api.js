async function pedirJSON(archivo) {
  const respuesta = await fetch(new URL("../../data/" + archivo, import.meta.url));

  if (!respuesta.ok) {
    throw new Error("No se pudo cargar " + archivo + " (" + respuesta.status + ")");
  }

  return respuesta.json();
}

export function cargarProductos() {
  return pedirJSON("productos.json");
}

export function cargarCartas() {
  return pedirJSON("cartas.json");
}

export function cargarInventario() {
  return pedirJSON("inventario.json");
}

export function cargarCategorias() {
  return pedirJSON("categorias.json");
}

export function cargarProbabilidades() {
  return pedirJSON("probabilidades.json");
}

export function cargarDescuentos() {
  return pedirJSON("descuentos.json");
}

export function cargarNegocio() {
  return pedirJSON("negocio.json");
}
