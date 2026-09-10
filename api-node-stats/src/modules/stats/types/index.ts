import { type Request } from "express";

export type Matrix = number[][];
export type NamedMatrices = Record<string, Matrix>;

export interface StatsResult {
  max: number;
  min: number;
  average: number;
  sum: number;
  diagonal: Record<string, boolean>;
  isAnyDiagonal: boolean;
}

export interface StatsRequestBody {
  q?: unknown;
  r?: unknown;
}

export type RequestWithStats = Request<
  Record<string, never>,
  StatsResult | { error: string },
  StatsRequestBody
>;
