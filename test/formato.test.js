import test from "node:test";
import assert from "node:assert/strict";
import { formatoPrecio, normalizar } from "../js/utilidades/formato.js";

test("formatoPrecio agrega el signo $ y separa los miles", () => {
  assert.equal(formatoPrecio(4900), "$4.900");
});

test("normalizar pasa a minúsculas y saca las tildes", () => {
  assert.equal(normalizar("Sobre Saiyan Élite"), "sobre saiyan elite");
});
