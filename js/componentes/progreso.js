const colores = ["", "azul", "verde", "amarillo"];

export function crearProgreso(colecciones, distintasPorColeccion) {
  return colecciones.map((coleccion, indice) => {
    const reunidas = distintasPorColeccion[coleccion.id] || 0;

    return `
      <div>
        <dt>${coleccion.nombre}</dt>
        <dd><progress class="barra ${colores[indice % colores.length]}" value="${reunidas}" max="${coleccion.total}">${reunidas} de ${coleccion.total}</progress> ${reunidas}/${coleccion.total}</dd>
      </div>`;
  }).join("");
}
