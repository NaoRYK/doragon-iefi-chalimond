import { cargarProductos, cargarProbabilidades, cargarCategorias } from "../datos/api.js";
import { formatoPrecio } from "../utilidades/formato.js";
import { agregarAlCarrito } from "../utilidades/tienda.js";
import { mostrarAviso } from "../utilidades/avisos.js";

const ventana = document.querySelector("#detalle");
let datos = null;
let producto = null;
let cantidad = 1;

async function obtenerDatos() {
  if (!datos) {
    const [productos, probabilidades, categorias] = await Promise.all([
      cargarProductos(),
      cargarProbabilidades(),
      cargarCategorias()
    ]);

    datos = { productos, probabilidades, colecciones: categorias.colecciones };
  }

  return datos;
}

function crearProbabilidades() {
  const tabla = datos.probabilidades[producto.id];

  if (!tabla) {
    return `<p class="subtitulo">Venta directa: sin azar, recibís exactamente la carta publicada.</p>`;
  }

  return `
    <div class="probabilidades">
      <h3>Probabilidades por rareza</h3>
      <ul>
        ${tabla.map((opcion) => `
          <li>
            <span>${opcion.rareza}★</span>
            <progress class="barra" max="100" value="${opcion.porcentaje}">${opcion.porcentaje}%</progress>
            <span>${opcion.porcentaje}%</span>
          </li>`).join("")}
      </ul>
    </div>`;
}

function crearAcciones() {
  if (producto.stock === 0) {
    return `<a class="boton tenue" href="nosotros.html#contacto">Avisame cuando vuelva</a>`;
  }

  const probar = producto.tipo === "sobres"
    ? `<a class="boton tenue" href="tirada.html?sobre=${producto.id}">Probar apertura</a>`
    : "";

  return `
    <button class="boton primario" type="button" data-accion="comprar">Comprar ahora</button>
    <button class="boton secundario" type="button" data-accion="agregar">Agregar al carrito</button>
    ${probar}`;
}

function crearContenido() {
  const coleccion = datos.colecciones.find((item) => item.id === producto.coleccion);
  const stock = producto.stock === 0 ? "Sin stock" : producto.stock + " disponibles";
  const bloqueado = producto.stock === 0 ? "disabled" : "";

  return `
    <div class="contenido-detalle">
      <img src="${producto.imagen}" alt="${producto.nombre}" width="134" height="184">

      <div class="informacion">
        <button class="cerrar" type="button" data-accion="cerrar" aria-label="Cerrar detalle">×</button>

        <p class="etiquetas">
          <span class="etiqueta">Colección ${coleccion.nombre}</span>
          <span class="etiqueta">${producto.rareza}★ posible</span>
        </p>

        <h2 id="detalle-titulo">${producto.nombre}</h2>
        <p class="subtitulo">${producto.descripcion}</p>

        ${crearProbabilidades()}

        <p class="stock">${stock}</p>

        <div class="compra">
          <p class="total" aria-live="polite" data-total>${formatoPrecio(producto.precio)}</p>

          <div class="cantidad">
            <button type="button" data-accion="menos" aria-label="Restar uno" ${bloqueado}>−</button>
            <label class="solo-lectores" for="detalle-cantidad">Cantidad</label>
            <input type="number" id="detalle-cantidad" min="1" max="${Math.max(producto.stock, 1)}" value="1" ${bloqueado}>
            <button type="button" data-accion="mas" aria-label="Sumar uno" ${bloqueado}>+</button>
          </div>

          ${crearAcciones()}
        </div>

        <p class="mensaje" role="status"></p>
      </div>
    </div>`;
}

function cambiarCantidad(nueva) {
  const maximo = Math.max(producto.stock, 1);
  cantidad = Math.min(Math.max(nueva || 1, 1), maximo);

  ventana.querySelector("#detalle-cantidad").value = cantidad;
  ventana.querySelector("[data-total]").textContent = formatoPrecio(producto.precio * cantidad);
}

function agregarSeleccion() {
  const agregado = agregarAlCarrito(producto, cantidad, false);
  const mensaje = ventana.querySelector(".mensaje");

  mensaje.textContent = agregado
    ? "Agregaste " + cantidad + " × " + producto.nombre + " al carrito."
    : "Ya tenés en el carrito todo el stock disponible.";

  return agregado;
}

export async function abrirDetalle(id) {
  try {
    await obtenerDatos();
  } catch (error) {
    mostrarAviso("No se pudo abrir el detalle del producto. Probá de nuevo en unos minutos.", "error");
    return;
  }

  producto = datos.productos.find((item) => item.id === id);
  cantidad = 1;
  ventana.innerHTML = crearContenido();
  ventana.showModal();
}

ventana.addEventListener("click", (evento) => {
  if (evento.target === ventana) {
    ventana.close();
    return;
  }

  const boton = evento.target.closest("[data-accion]");

  if (!boton) {
    return;
  }

  const accion = boton.dataset.accion;

  if (accion === "cerrar") {
    ventana.close();
  } else if (accion === "mas") {
    cambiarCantidad(cantidad + 1);
  } else if (accion === "menos") {
    cambiarCantidad(cantidad - 1);
  } else if (accion === "agregar") {
    agregarSeleccion();
  } else if (accion === "comprar" && agregarSeleccion()) {
    location.href = "carrito.html";
  }
});

ventana.addEventListener("change", (evento) => {
  if (evento.target.id === "detalle-cantidad") {
    cambiarCantidad(Number(evento.target.value));
  }
});
