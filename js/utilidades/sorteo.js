export function sortearRareza(tabla, azar = Math.random() * 100) {
  let acumulado = 0;

  for (const opcion of tabla) {
    acumulado += opcion.porcentaje;
    if (azar < acumulado) {
      return opcion.rareza;
    }
  }

  return tabla[tabla.length - 1].rareza;
}

export function elegirAlAzar(lista, azar = Math.random()) {
  return lista[Math.floor(azar * lista.length)];
}
