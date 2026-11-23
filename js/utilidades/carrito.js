export function agregarItem(items, id, cantidad, stock) {
  const tope = Math.max(stock, 1);
  const existente = items.find((item) => item.id === id);

  if (existente) {
    return items.map((item) =>
      item.id === id ? { ...item, cantidad: Math.min(item.cantidad + cantidad, tope) } : item
    );
  }

  return [...items, { id, cantidad: Math.min(cantidad, tope) }];
}

export function cambiarCantidad(items, id, cantidad, stock) {
  const valida = Math.min(Math.max(cantidad || 1, 1), Math.max(stock, 1));
  return items.map((item) => (item.id === id ? { ...item, cantidad: valida } : item));
}

export function quitarItem(items, id) {
  return items.filter((item) => item.id !== id);
}

export function contarUnidades(items) {
  return items.reduce((total, item) => total + item.cantidad, 0);
}

export function calcularTotales(items, productos, descuentoDrop, porcentajeCodigo) {
  const subtotal = items.reduce((suma, item) => {
    const producto = productos.find((registro) => registro.id === item.id);
    return producto ? suma + producto.precio * item.cantidad : suma;
  }, 0);

  const drop = Math.min(descuentoDrop, subtotal);
  const codigo = Math.round(subtotal * porcentajeCodigo);

  return { subtotal, drop, codigo, total: Math.max(subtotal - drop - codigo, 0) };
}
