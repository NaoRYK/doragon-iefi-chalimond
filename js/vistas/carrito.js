import { cargarProductos, cargarDescuentos } from "../datos/api.js";
import { leerCarrito, guardarCarrito, leerCodigo, guardarCodigo } from "../utilidades/estado.js";
import { cambiarCantidad, quitarItem, contarUnidades, calcularTotales } from "../utilidades/carrito.js";
import { formatoPrecio } from "../utilidades/formato.js";
import { mostrarContador } from "../utilidades/contador.js";
import { mostrarAviso } from "../utilidades/avisos.js";

let productos = [];
let descuentos = { drop: 0, codigos: {} };

try {
  [productos, descuentos] = await Promise.all([cargarProductos(), cargarDescuentos()]);
} catch (error) {
  mostrarAviso("No se pudo cargar el carrito. Probá de nuevo en unos minutos.", "error");
}

function buscarProducto(id) {
  return productos.find((producto) => producto.id === id);
}

let items = leerCarrito().filter((item) => buscarProducto(item.id));
let codigoAplicado = leerCodigo();
let porcentajeCodigo = descuentos.codigos[codigoAplicado] || 0;

if (porcentajeCodigo === 0) {
  codigoAplicado = "";
}

const lista = document.querySelector("#lista-carrito");
const titulo = document.querySelector("#cantidad-items");
const unidad = document.querySelector("#cantidad-unidad");
const vacio = document.querySelector("#carrito-vacio");
const totales = document.querySelector("#totales");
const irAlPago = document.querySelector("#ir-pago");
const formularioDescuento = document.querySelector("#form-descuento");
const campoCodigo = document.querySelector("#codigo");
const mensajeDescuento = document.querySelector("#mensaje-descuento");

function crearItem(item) {
  const producto = buscarProducto(item.id);

  return `
    <li class="item" data-id="${producto.id}">
      <img src="${producto.imagen}" alt="${producto.nombre}" width="134" height="184">
      <div>
        <h3>${producto.nombre}</h3>
        <p class="detalle">${producto.detalle}</p>
      </div>
      <div class="campo">
        <label class="solo-lectores" for="cantidad-${producto.id}">Cantidad de ${producto.nombre}</label>
        <input type="number" id="cantidad-${producto.id}" min="1" max="${producto.stock}" value="${item.cantidad}">
      </div>
      <div class="importe">
        <p class="precio">${formatoPrecio(producto.precio * item.cantidad)}</p>
        <button class="boton secundario chico" type="button" data-accion="quitar" data-id="${producto.id}">Quitar</button>
      </div>
    </li>`;
}

function mostrarTotales() {
  const resumen = calcularTotales(items, productos, descuentos.drop, porcentajeCodigo);
  const unidades = contarUnidades(items);

  const lineaDrop = resumen.drop > 0
    ? `<div><dt>Descuento drop</dt><dd>−${formatoPrecio(resumen.drop)}</dd></div>`
    : "";

  const lineaCodigo = codigoAplicado !== "" && resumen.codigo > 0
    ? `<div><dt>Código ${codigoAplicado}</dt><dd>−${formatoPrecio(resumen.codigo)}</dd></div>`
    : "";

  totales.innerHTML = `
    <div><dt>Subtotal</dt><dd>${formatoPrecio(resumen.subtotal)}</dd></div>
    <div><dt>Envío</dt><dd>Gratis</dd></div>
    ${lineaDrop}
    ${lineaCodigo}
    <div class="total"><dt>Total</dt><dd>${formatoPrecio(resumen.total)}</dd></div>`;

  titulo.textContent = unidades;
  unidad.textContent = unidades === 1 ? "producto" : "productos";
  vacio.hidden = items.length > 0;
  irAlPago.hidden = items.length === 0;
  mostrarContador();
}

function actualizarCantidad(id, valor) {
  items = cambiarCantidad(items, id, valor, buscarProducto(id).stock);
  guardarCarrito(items);

  const item = items.find((registro) => registro.id === id);
  const fila = lista.querySelector(`[data-id="${id}"]`);

  fila.querySelector("input").value = item.cantidad;
  fila.querySelector(".precio").textContent = formatoPrecio(buscarProducto(id).precio * item.cantidad);

  mostrarTotales();
}

function quitarDelCarrito(id) {
  items = quitarItem(items, id);
  guardarCarrito(items);
  lista.querySelector(`[data-id="${id}"]`).remove();
  mostrarTotales();
}

function aplicarCodigo(evento) {
  evento.preventDefault();

  const codigo = campoCodigo.value.trim().toUpperCase();

  if (descuentos.codigos[codigo]) {
    porcentajeCodigo = descuentos.codigos[codigo];
    codigoAplicado = codigo;
    mensajeDescuento.textContent = `Código aplicado: ${porcentajeCodigo * 100}% de descuento.`;
  } else {
    porcentajeCodigo = 0;
    codigoAplicado = "";
    mensajeDescuento.textContent = "El código no es válido.";
  }

  guardarCodigo(codigoAplicado);
  mostrarTotales();
}

lista.addEventListener("change", (evento) => {
  const fila = evento.target.closest("[data-id]");

  if (fila && evento.target.type === "number") {
    actualizarCantidad(fila.dataset.id, Number(evento.target.value));
  }
});

lista.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-accion='quitar']");

  if (boton) {
    quitarDelCarrito(boton.dataset.id);
  }
});

formularioDescuento.addEventListener("submit", aplicarCodigo);

lista.innerHTML = items.map(crearItem).join("");
mostrarTotales();
