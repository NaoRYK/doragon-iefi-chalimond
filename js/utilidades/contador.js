import { leerCarrito } from "./estado.js";
import { contarUnidades } from "./carrito.js";

const contador = document.querySelector(".cabecera .contador");
const textoOculto = document.querySelector(".cabecera .icono.carrito .solo-lectores");

export function mostrarContador() {
  const unidades = contarUnidades(leerCarrito());

  contador.textContent = unidades;
  textoOculto.textContent = "Carrito, " + unidades + (unidades === 1 ? " producto" : " productos");
}
