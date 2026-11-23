import { formatoPrecio } from "./formato.js";

export function generarNumeroPedido(azar = Math.random()) {
  return "DR-" + Math.floor(10000 + azar * 90000);
}

export function armarMensajePedido(pedido) {
  const lineas = pedido.items.map(
    (item) => "- " + item.nombre + " x" + item.cantidad + ": " + formatoPrecio(item.precio * item.cantidad)
  );

  return [
    "Hola, quiero confirmar mi pedido " + pedido.numero + ".",
    "",
    ...lineas,
    "",
    "Total: " + formatoPrecio(pedido.total),
    "Pago: " + pedido.metodoPago,
    "Nombre: " + pedido.cliente.nombre,
    "Documento: " + pedido.cliente.documento,
    "Envío a: " + pedido.cliente.direccion + ", " + pedido.cliente.ciudad
  ].join("\n");
}

export function armarEnlaceWhatsApp(numero, mensaje) {
  return "https://wa.me/" + numero + "?text=" + encodeURIComponent(mensaje);
}
