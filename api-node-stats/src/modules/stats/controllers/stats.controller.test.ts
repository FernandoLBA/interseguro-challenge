import assert from "node:assert/strict";
import { test } from "node:test";
import { type Response } from "express";
import { type StatsService } from "../services/stats.service.js";
import { type RequestWithStats, type StatsResult } from "../types/index.js";
import { StatsController } from "./stats.controller.js";

function fakeRequest(body: RequestWithStats["body"]): RequestWithStats {
  return { body } as RequestWithStats;
}

function fakeResponse() {
  const res = {
    statusCode: undefined as number | undefined,
    body: undefined as unknown,
    status(code: number) {
      res.statusCode = code;

      return res;
    },
    json(payload: unknown) {
      res.body = payload;

      return res;
    },
  };

  return res as unknown as Response & typeof res;
}

function fakeService(
  impl: Pick<StatsService, "computeStats">,
): StatsService {
  return impl as StatsService;
}

test("computeStats responde 400 si falta la matriz q", () => {
  const controller = new StatsController(fakeService({ computeStats() {
    throw new Error("no debería llamarse");
  } }));

  const res = fakeResponse();

  controller.computeStats(fakeRequest({ r: [[1]] }), res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: "Se requieren las matrices 'q' y 'r'" });
});

test("computeStats responde 400 si falta la matriz r", () => {
  const controller = new StatsController(fakeService({ computeStats() {
    throw new Error("no debería llamarse");
  } }));

  const res = fakeResponse();

  controller.computeStats(fakeRequest({ q: [[1]] }), res);

  assert.equal(res.statusCode, 400);
});

test("computeStats responde 200 con el resultado del service cuando todo es válido", () => {
  const expected: StatsResult = {
    max: 1,
    min: 0,
    average: 0.5,
    sum: 1,
    diagonal: { q: true, r: true },
    isAnyDiagonal: true,
  };

  const controller = new StatsController(
    fakeService({
      computeStats() {
        return expected;
      },
    }),
  );

  const res = fakeResponse();

  controller.computeStats(fakeRequest({ q: [[1]], r: [[0]] }), res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, expected);
});

test("computeStats responde 422 con el mensaje del error de negocio", () => {
  const controller = new StatsController(
    fakeService({
      computeStats() {
        throw new Error("La matriz \"q\" debe ser rectangular");
      },
    }),
  );

  const res = fakeResponse();

  controller.computeStats(fakeRequest({ q: [[1, 2], [3]], r: [[1]] }), res);

  assert.equal(res.statusCode, 422);
  assert.deepEqual(res.body, {
    error: 'La matriz "q" debe ser rectangular',
  });
});

test("computeStats responde 422 con mensaje genérico si se lanza algo que no es un Error", () => {
  const controller = new StatsController(
    fakeService({
      computeStats() {
        throw "no soy un Error";
      },
    }),
  );

  const res = fakeResponse();

  controller.computeStats(fakeRequest({ q: [[1]], r: [[1]] }), res);

  assert.equal(res.statusCode, 422);
  assert.deepEqual(res.body, {
    error: "Error desconocido al calcular estadísticas",
  });
});
