import {
  type Matrix,
  type NamedMatrices,
  type StatsResult,
} from "../types/index.js";

export class StatsRepository {
  computeStats(namedMatrices: Record<string, unknown>): StatsResult {
    const names = Object.keys(namedMatrices);

    if (names.length === 0) {
      throw new Error("Se requiere al menos una matriz para el cálculo");
    }

    const validated: NamedMatrices = {};

    for (const name of names) {
      const candidate = namedMatrices[name];

      this.assertValidMatrix(candidate, name);

      validated[name] = candidate;
    }

    let max = -Infinity;
    let min = Infinity;
    let sum = 0;
    let count = 0;

    for (const name of names) {
      for (const row of validated[name]!) {
        for (const value of row) {
          if (value > max) max = value;
          if (value < min) min = value;

          sum += value;
          count += 1;
        }
      }
    }

    const diagonal: Record<string, boolean> = {};

    for (const name of names) {
      diagonal[name] = this.isDiagonal(validated[name]!);
    }

    const isAnyDiagonal = Object.values(diagonal).some(Boolean);

    return {
      max,
      min,
      average: sum / count,
      sum,
      diagonal,
      isAnyDiagonal,
    };
  }

  private assertValidMatrix(
    matrix: unknown,
    label: string,
  ): asserts matrix is Matrix {
    if (!Array.isArray(matrix) || matrix.length === 0) {
      throw new Error(
        `La matriz "${label}" debe ser un array de array de números, no debe estar vacío`,
      );
    }

    const firstRow = matrix[0];

    if (!Array.isArray(firstRow)) {
      throw new Error(
        `La matriz "${label}" debe ser un array de arrays de números`,
      );
    }

    const cols = firstRow.length;

    for (const row of matrix) {
      if (!Array.isArray(row) || row.length !== cols) {
        throw new Error(`La matriz "${label}" debe ser rectangular`);
      }

      for (const value of row) {
        if (typeof value !== "number" || Number.isNaN(value)) {
          throw new Error(`La matriz "${label}" contiene un valor no numérico`);
        }
      }
    }
  }

  private isDiagonal(matrix: Matrix, epsilon = 1e-9): boolean {
    const rows = matrix.length;
    const cols = matrix[0]?.length ?? 0;

    if (rows !== cols) {
      return false;
    }

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (i !== j && Math.abs(matrix[i]![j]!) > epsilon) {
          return false;
        }
      }
    }

    return true;
  }
}
