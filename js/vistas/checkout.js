import { cargarProductos, cargarDescuentos, cargarNegocio } from "../datos/api.js";
import { leerCarrito, leerCodigo, vaciarCarrito, guardarPedido } from "../utilidades/estado.js";
import { calcularTotales } from "../utilidades/carrito.js";
import { formatoPrecio } from "../utilidades/formato.js";
import { esNombreValido, esDniValido, esTarjetaValida, esVencimientoValido, esCvvValido } from "../utilidades/validaciones.js";
import { generarNumeroPedido, armarMensajePedido, armarEnlaceWhatsApp } from "../utilidades/pedido.js";
import { marcarError } from "../utilidades/formularios.js";
import { mostrarContador } from "../utilidades/contador.js";
import { mostrarAviso } from "../utilidades/avisos.js";

const formulario = document.querySelector("#pago");
const bloques = formulario.querySelectorAll("[data-metodo]");
const listaPedido = document.querySelector("#pedido-items");
const totalesPedido = document.querySelector("#pedido-totales");
const botonPagar = formulario.querySelector("button[type='submit']");
const tarjeta = formulario.querySelector("#chk-tarjeta");
const vencimiento = formulario.querySelector("#chk-vencimiento");
const cvv = formulario.querySelector("#chk-cvv");

const nombresMetodo = {
  tarjeta: "Tarjeta",
  billetera: "Billetera virtual",
  transferencia: "Transferencia"
};

let productos = [];
let descuentos = { drop: 0, codigos: {} };
let negocio = { whatsapp: "" };

try {
  [productos, descuentos, negocio] = await Promise.all([cargarProductos(), cargarDescuentos(), cargarNegocio()]);
} catch (error) {
  mostrarAviso("No se pudieron cargar los datos del pedido. Probá de nuevo en unos minutos.", "error");
}

const items = leerCarrito().filter((item) => productos.some((producto) => producto.id === item.id));
const totales = calcularTotales(items, productos, descuentos.drop, descuentos.codigos[leerCodigo()] || 0);

function metodoElegido() {
  return formulario.querySelector("input[name='metodo-pago']:checked").value;
}

function mostrarMetodo() {
  const elegido = metodoElegido();

  bloques.forEach((bloque) => {
    const activo = bloque.dataset.metodo === elegido;

    bloque.hidden = !activo;

    bloque.querySelectorAll("input").forEach((campo) => {
      campo.disabled = !activo;
    });
  });
}

function mostrarPedido() {
  listaPedido.innerHTML = items.map((item) => {
    const producto = productos.find((registro) => registro.id === item.id);

    return `
      <li>
        <span>${producto.nombre} x${item.cantidad}</span>
        <span class="precio">${formatoPrecio(producto.precio * item.cantidad)}</span>
      </li>`;
  }).join("");

  const lineaDrop = totales.drop > 0
    ? `<div><dt>Descuento drop</dt><dd>−${formatoPrecio(totales.drop)}</dd></div>`
    : "";

  const lineaCodigo = totales.codigo > 0
    ? `<div><dt>Código ${leerCodigo()}</dt><dd>−${formatoPrecio(totales.codigo)}</dd></div>`
    : "";

  totalesPedido.innerHTML = `
    ${lineaDrop}
    ${lineaCodigo}
    <div class="total"><dt>Total</dt><dd>${formatoPrecio(totales.total)}</dd></div>`;
}

function buscarError() {
  const campos = formulario.elements;

  const reglas = [
    [campos.nombre, esNombreValido(campos.nombre.value), "Escribí tu nombre y apellido, solo con letras."],
    [campos.documento, esDniValido(campos.documento.value), "El documento tiene que tener 7 u 8 números, sin puntos."]
  ];

  if (metodoElegido() === "tarjeta") {
    reglas.push(
      [tarjeta, esTarjetaValida(tarjeta.value), "El número de tarjeta no es válido. Para probar usá 4242 4242 4242 4242."],
      [vencimiento, esVencimientoValido(vencimiento.value), "El vencimiento no es válido o la tarjeta ya venció."],
      [cvv, esCvvValido(cvv.value), "El CVV tiene que tener 3 o 4 números."]
    );
  }

  return reglas.find((regla) => !regla[1]);
}

function armarPedido() {
  const datos = new FormData(formulario);

  return {
    numero: generarNumeroPedido(),
    fecha: new Date().toISOString(),
    items: items.map((item) => {
      const producto = productos.find((registro) => registro.id === item.id);
      return { id: producto.id, nombre: producto.nombre, tipo: producto.tipo, precio: producto.precio, cantidad: item.cantidad };
    }),
    ...totales,
    metodoPago: nombresMetodo[datos.get("metodo-pago")],
    cliente: {
      nombre: datos.get("nombre").trim(),
      documento: datos.get("documento").trim(),
      direccion: datos.get("direccion").trim(),
      ciudad: datos.get("ciudad").trim()
    }
  };
}

formulario.addEventListener("change", (evento) => {
  if (evento.target.name === "metodo-pago") {
    mostrarMetodo();
  }
});

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (items.length === 0) {
    mostrarAviso("Tu carrito está vacío. Agregá productos desde el catálogo.", "error");
    return;
  }

  const error = buscarError();

  if (error) {
    marcarError(error[0], error[2]);
    return;
  }

  const pedido = armarPedido();

  guardarPedido(pedido);
  vaciarCarrito();
  mostrarContador();
  window.open(armarEnlaceWhatsApp(negocio.whatsapp, armarMensajePedido(pedido)), "_blank", "noopener");
  location.href = "confirmacion.html";
});

mostrarMetodo();
mostrarPedido();

if (items.length === 0) {
  botonPagar.disabled = true;
  mostrarAviso("Tu carrito está vacío. Agregá productos desde el catálogo.", "error");
}
