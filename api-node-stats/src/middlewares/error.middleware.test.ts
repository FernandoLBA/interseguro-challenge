import assert from "node:assert/strict";
import { test } from "node:test";
import { type NextFunction, type Request, type Response } from "express";
import { errorHandler } from "./error.middleware.js";

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

test("errorHandler responde 500 con el mensaje del error", () => {
  const res = fakeResponse();
  const req = {} as Request;
  const next = (() => {}) as NextFunction;

  errorHandler(new Error("boom"), req, res, next);

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, { status: "Error", message: "boom" });
});

test("errorHandler usa un mensaje por defecto si el error no trae mensaje", () => {
  const res = fakeResponse();
  const req = {} as Request;
  const next = (() => {}) as NextFunction;

  errorHandler(new Error(""), req, res, next);

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, {
    status: "Error",
    message: "Error interno del servidor",
  });
});
