export function esNombreValido(texto) {
  return /^\p{L}[\p{L} .'-]{2,}$/u.test(texto.trim());
}

export function esEmailValido(texto) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(texto.trim());
}

export function esDniValido(texto) {
  return /^[0-9]{7,8}$/.test(texto.trim());
}

export function esTarjetaValida(texto) {
  const numero = texto.replace(/\s/g, "");

  if (!/^[0-9]{16}$/.test(numero)) {
    return false;
  }

  let suma = 0;

  [...numero].reverse().forEach((digito, indice) => {
    let valor = Number(digito);

    if (indice % 2 === 1) {
      valor *= 2;

      if (valor > 9) {
        valor -= 9;
      }
    }

    suma += valor;
  });

  return suma % 10 === 0;
}

export function esVencimientoValido(texto, hoy = new Date()) {
  const partes = /^(0[1-9]|1[0-2])\/([0-9]{2})$/.exec(texto);

  if (!partes) {
    return false;
  }

  const mes = Number(partes[1]);
  const anio = 2000 + Number(partes[2]);

  return anio > hoy.getFullYear() || (anio === hoy.getFullYear() && mes >= hoy.getMonth() + 1);
}

export function esCvvValido(texto) {
  return /^[0-9]{3,4}$/.test(texto);
}
