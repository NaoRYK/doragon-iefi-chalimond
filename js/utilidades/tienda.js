import { leerCarrito, guardarCarrito } from "./estado.js";
import { agregarItem, contarUnidades } from "./carrito.js";
import { mostrarContador } from "./contador.js";
import { mostrarAviso } from "./avisos.js";

export function agregarAlCarrito(producto, cantidad = 1, avisar = true) {
  const antes = leerCarrito();
  const despues = agregarItem(antes, producto.id, cantidad, producto.stock);

  if (contarUnidades(despues) === contarUnidades(antes)) {
    mostrarAviso("Ya tenés en el carrito todo el stock disponible de este producto.", "error");
    return false;
  }

  guardarCarrito(despues);
  mostrarContador();

  if (avisar) {
    mostrarAviso("Agregaste " + producto.nombre + " al carrito.");
  }

  return true;
}
