import { esNombreValido, esEmailValido } from "../utilidades/validaciones.js";
import { marcarError } from "../utilidades/formularios.js";
import { mostrarAviso } from "../utilidades/avisos.js";

const formulario = document.querySelector("#form-contacto");

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const { nombre, email, mensaje } = formulario.elements;

  if (!esNombreValido(nombre.value)) {
    marcarError(nombre, "Escribí tu nombre y apellido, solo con letras.");
    return;
  }

  if (!esEmailValido(email.value)) {
    marcarError(email, "Escribí un email válido, por ejemplo tu@email.com.");
    return;
  }

  mostrarAviso("Gracias por escribirnos. Te respondemos en 24 a 48 horas hábiles.");
  formulario.reset();
  mensaje.dispatchEvent(new Event("input"));
});
