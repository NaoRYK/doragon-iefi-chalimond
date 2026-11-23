export function agregarCartas(inventario, ids) {
  return ids.reduce((resultado, id) => {
    const existente = resultado.find((item) => item.id === id);

    if (existente) {
      return resultado.map((item) => (item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item));
    }

    return [...resultado, { id, cantidad: 1 }];
  }, inventario);
}

export function calcularEstadisticas(inventario, cartas) {
  let total = 0;
  let cincoEstrellas = 0;
  let duplicadas = 0;
  const distintasPorColeccion = {};

  inventario.forEach((item) => {
    const carta = cartas.find((registro) => registro.id === item.id);

    if (!carta) {
      return;
    }

    total += item.cantidad;
    duplicadas += item.cantidad - 1;
    distintasPorColeccion[carta.coleccion] = (distintasPorColeccion[carta.coleccion] || 0) + 1;

    if (carta.rareza === 5) {
      cincoEstrellas += item.cantidad;
    }
  });

  return { total, cincoEstrellas, duplicadas, distintasPorColeccion };
}
