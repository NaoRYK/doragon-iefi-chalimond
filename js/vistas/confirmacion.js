import { cargarNegocio } from "../datos/api.js";
import { leerUltimoPedido } from "../utilidades/estado.js";
import { armarMensajePedido, armarEnlaceWhatsApp } from "../utilidades/pedido.js";
import { formatoPrecio } from "../utilidades/formato.js";
import { mostrarAviso } from "../utilidades/avisos.js";

const pedido = leerUltimoPedido();
const confirmado = document.querySelector("#conf-pedido");
const sinPedido = document.querySelector("#conf-vacio");

if (!pedido) {
  confirmado.hidden = true;
  sinPedido.hidden = false;
} else {
  const entrega = new Date(pedido.fecha);
  entrega.setDate(entrega.getDate() + 3);

  document.querySelector("#conf-numero").textContent = pedido.numero;
  document.querySelector("#conf-total").textContent = formatoPrecio(pedido.total);
  document.querySelector("#conf-entrega").textContent = entrega.toLocaleDateString("es-AR", { day: "numeric", month: "long" });

  const sobre = pedido.items.find((item) => item.tipo === "sobres");
  const abrir = document.querySelector("#conf-abrir");

  if (sobre) {
    abrir.href = "tirada.html?sobre=" + sobre.id;
  } else {
    abrir.textContent = "Seguir comprando";
    abrir.href = "catalogo.html";
  }

  mostrarAviso("Tu pedido " + pedido.numero + " se envió por WhatsApp.");

  try {
    const negocio = await cargarNegocio();
    const enlace = document.querySelector("#conf-whatsapp");

    enlace.href = armarEnlaceWhatsApp(negocio.whatsapp, armarMensajePedido(pedido));
    enlace.hidden = false;
  } catch (error) {
    mostrarAviso("No se pudo preparar el enlace de WhatsApp.", "error");
  }
}
