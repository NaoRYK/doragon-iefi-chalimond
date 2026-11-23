import { leer, guardar, borrar } from "./almacenamiento.js";

const claves = {
  carrito: "doragon.carrito",
  codigo: "doragon.codigo",
  inventario: "doragon.inventario",
  pedidos: "doragon.pedidos",
  ultimoPedido: "doragon.ultimoPedido",
  sobresAbiertos: "doragon.sobresAbiertos"
};

export function leerCarrito() {
  return leer(claves.carrito, []);
}

export function guardarCarrito(items) {
  guardar(claves.carrito, items);
}

export function vaciarCarrito() {
  borrar(claves.carrito);
  borrar(claves.codigo);
}

export function leerCodigo() {
  return leer(claves.codigo, "");
}

export function guardarCodigo(codigo) {
  guardar(claves.codigo, codigo);
}

export function leerInventario(inicial) {
  return leer(claves.inventario, inicial);
}

export function guardarInventario(inventario) {
  guardar(claves.inventario, inventario);
}

export function guardarPedido(pedido) {
  const pedidos = leer(claves.pedidos, []);
  pedidos.push(pedido);
  guardar(claves.pedidos, pedidos);
  guardar(claves.ultimoPedido, pedido);
}

export function leerUltimoPedido() {
  return leer(claves.ultimoPedido, null);
}

export function leerSobresAbiertos() {
  return leer(claves.sobresAbiertos, 0);
}

export function sumarSobreAbierto() {
  guardar(claves.sobresAbiertos, leerSobresAbiertos() + 1);
}
