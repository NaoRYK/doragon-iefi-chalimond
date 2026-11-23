import { mostrarContador } from "./utilidades/contador.js";
import { prepararAvisos } from "./utilidades/avisos.js";
import { esEmailValido } from "./utilidades/validaciones.js";
import { marcarError } from "./utilidades/formularios.js";

const formularios = document.querySelectorAll("form[data-mensaje]");
const contadores = document.querySelectorAll("[data-contador-de]");
const actualizadores = [];

prepararAvisos();
mostrarContador();

formularios.forEach((formulario) => {
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const email = formulario.querySelector("input[type='email']");

    if (email && !esEmailValido(email.value)) {
      marcarError(email, "Escribí un email válido, por ejemplo tu@email.com.");
      return;
    }

    let mensaje = formulario.querySelector(".mensaje");

    if (!mensaje) {
      mensaje = document.createElement("p");
      mensaje.className = "mensaje";
      mensaje.setAttribute("role", "status");
      formulario.append(mensaje);
    }

    mensaje.textContent = formulario.dataset.mensaje;
    formulario.reset();
    actualizadores.forEach((actualizar) => actualizar());
  });
});

contadores.forEach((contador) => {
  const campo = document.querySelector("#" + contador.dataset.contadorDe);

  function actualizar() {
    contador.textContent = campo.value.length + " / " + campo.maxLength;
  }

  campo.addEventListener("input", actualizar);
  actualizadores.push(actualizar);
  actualizar();
});
