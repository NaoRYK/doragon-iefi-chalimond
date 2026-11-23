import { cargarCartas, cargarCategorias, cargarInventario } from "../datos/api.js";
import { numeroCarta } from "../utilidades/formato.js";
import { leerInventario, leerSobresAbiertos } from "../utilidades/estado.js";
import { calcularEstadisticas } from "../utilidades/inventario.js";
import { crearProgreso } from "../componentes/progreso.js";
import { mostrarAviso } from "../utilidades/avisos.js";

const filtro = document.querySelector("#filtro-inventario");
const lista = document.querySelector("#lista-inventario");
const vacio = document.querySelector("#inventario-vacio");

let cartas = [];
let colecciones = [];
let inventario = [];

try {
  const [listaCartas, categorias, inicial] = await Promise.all([cargarCartas(), cargarCategorias(), cargarInventario()]);

  cartas = listaCartas;
  colecciones = categorias.colecciones;
  inventario = leerInventario(inicial);
} catch (error) {
  mostrarAviso("No se pudo cargar tu inventario. Probá de nuevo en unos minutos.", "error");
}

function crearCarta(item) {
  const carta = cartas.find((registro) => registro.id === item.id);
  const coleccion = colecciones.find((registro) => registro.id === carta.coleccion);
  const repetida = item.cantidad > 1;
  const cantidad = repetida ? ` · x${item.cantidad}` : "";

  return `
    <li class="tarjeta-carta vertical" data-rareza="${carta.rareza}" data-duplicada="${repetida}">
      <img src="${carta.imagen}" alt="Carta de ${carta.nombre}" width="293" height="210">
      <h3 class="nombre">${carta.nombre}</h3>
      <p class="detalle">${carta.rareza}★ · ${numeroCarta(carta.numero, coleccion.total)}${cantidad}</p>
    </li>`;
}

function mostrarEstadisticas() {
  const estadisticas = calcularEstadisticas(inventario, cartas);
  const abiertos = leerSobresAbiertos();

  document.querySelector("#est-total").textContent = estadisticas.total;
  document.querySelector("#est-cinco").textContent = estadisticas.cincoEstrellas;
  document.querySelector("#est-abiertos").textContent = abiertos;
  document.querySelector("#est-duplicadas").textContent = estadisticas.duplicadas;
  document.querySelector("#progreso-lista").innerHTML = crearProgreso(colecciones, estadisticas.distintasPorColeccion);
  document.querySelector("#tiradas-resumen").textContent =
    abiertos + (abiertos === 1 ? " sobre abierto" : " sobres abiertos") + " hasta ahora. Abrí uno nuevo cuando quieras.";
}

function mostrarCartas() {
  const elegido = filtro.querySelector("input:checked").value;
  let visibles = 0;

  [...lista.children].forEach((carta) => {
    let mostrar = true;

    if (elegido === "duplicadas") {
      mostrar = carta.dataset.duplicada === "true";
    } else if (elegido !== "todas") {
      mostrar = carta.dataset.rareza === elegido;
    }

    carta.hidden = !mostrar;

    if (mostrar) {
      visibles++;
    }
  });

  vacio.hidden = visibles > 0;
}

filtro.addEventListener("input", mostrarCartas);

lista.innerHTML = inventario.map(crearCarta).join("");
mostrarEstadisticas();
mostrarCartas();
