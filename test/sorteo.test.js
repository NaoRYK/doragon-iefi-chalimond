import test from "node:test";
import assert from "node:assert/strict";
import { sortearRareza, elegirAlAzar } from "../js/utilidades/sorteo.js";

const tabla = [
  { rareza: 5, porcentaje: 4 },
  { rareza: 4, porcentaje: 16 },
  { rareza: 3, porcentaje: 35 },
  { rareza: 2, porcentaje: 45 }
];

test("sortearRareza devuelve la rareza del tramo donde cae el azar", () => {
  assert.equal(sortearRareza(tabla, 3.9), 5);
  assert.equal(sortearRareza(tabla, 37.2), 3);
  assert.equal(sortearRareza(tabla, 99.9), 2);
});

test("sortearRareza respeta los bordes de cada tramo", () => {
  assert.equal(sortearRareza(tabla, 4), 4);
  assert.equal(sortearRareza(tabla, 20), 3);
});

test("elegirAlAzar devuelve un elemento de la lista", () => {
  assert.equal(elegirAlAzar(["a", "b", "c"], 0.5), "b");
});
