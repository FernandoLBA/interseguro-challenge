import assert from "node:assert/strict";
import { test } from "node:test";
import { StatsRepository } from "./stats.repository.js";

test("computeStats calcula max, min, sum, average y diagonal correctamente", () => {
  const repository = new StatsRepository();

  const result = repository.computeStats({
    q: [
      [1, 0],
      [0, 1],
    ],
    r: [
      [2, 0],
      [0, 2],
    ],
  });

  assert.deepEqual(result, {
    max: 2,
    min: 0,
    sum: 6,
    average: 0.75,
    diagonal: { q: true, r: true },
    isAnyDiagonal: true,
  });
});

test("computeStats marca diagonal en false cuando hay un valor fuera de la diagonal", () => {
  const repository = new StatsRepository();

  const result = repository.computeStats({
    q: [
      [5, 1],
      [0, 5],
    ],
  });

  assert.equal(result.diagonal.q, false);
  assert.equal(result.isAnyDiagonal, false);
});

test("computeStats marca diagonal en false cuando la matriz no es cuadrada", () => {
  const repository = new StatsRepository();

  const result = repository.computeStats({
    q: [
      [1, 0, 0],
      [0, 1, 0],
    ],
  });

  assert.equal(result.diagonal.q, false);
});

test("computeStats lanza error si no se envía ninguna matriz", () => {
  const repository = new StatsRepository();

  assert.throws(
    () => repository.computeStats({}),
    /Se requiere al menos una matriz/,
  );
});

test("computeStats lanza error si la matriz no es un array", () => {
  const repository = new StatsRepository();

  assert.throws(
    () => repository.computeStats({ q: "no soy una matriz" }),
    /debe ser un array de array de números/,
  );
});

test("computeStats lanza error si la matriz está vacía", () => {
  const repository = new StatsRepository();

  assert.throws(
    () => repository.computeStats({ q: [] }),
    /debe ser un array de array de números/,
  );
});

test("computeStats lanza error si las filas no tienen la misma cantidad de columnas", () => {
  const repository = new StatsRepository();

  assert.throws(
    () =>
      repository.computeStats({
        q: [
          [1, 2],
          [3],
        ],
      }),
    /debe ser rectangular/,
  );
});

test("computeStats lanza error si la matriz contiene valores no numéricos", () => {
  const repository = new StatsRepository();

  assert.throws(
    () =>
      repository.computeStats({
        q: [[1, "dos"]],
      }),
    /contiene un valor no numérico/,
  );
});
