import { cargarProductos } from "../datos/api.js";
import { crearTarjeta } from "../componentes/tarjeta.js";
import { agregarAlCarrito } from "../utilidades/tienda.js";
import { mostrarAviso } from "../utilidades/avisos.js";

const destacados = document.querySelector("#destacados");
let productos = [];

try {
  productos = await cargarProductos();

  destacados.innerHTML = productos
    .filter((producto) => producto.destacado)
    .map((producto) => crearTarjeta(producto, false))
    .join("");
} catch (error) {
  destacados.innerHTML = `<li class="vacio">No se pudieron cargar los productos destacados.</li>`;
  mostrarAviso("No se pudieron cargar los productos. Probá de nuevo en unos minutos.", "error");
}

destacados.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-accion='agregar']");

  if (boton) {
    agregarAlCarrito(productos.find((producto) => producto.id === boton.dataset.id));
  }
});
