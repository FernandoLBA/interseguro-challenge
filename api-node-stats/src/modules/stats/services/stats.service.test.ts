import assert from "node:assert/strict";
import { test } from "node:test";
import { type StatsRepository } from "../repositories/stats.repository.js";
import { type StatsResult } from "../types/index.js";
import { StatsService } from "./stats.service.js";

function fakeRepository(
  impl: Pick<StatsRepository, "computeStats">,
): StatsRepository {
  return impl as StatsRepository;
}

test("computeStats arma un NamedMatrices con q y r y delega al repository", () => {
  let receivedArg: unknown;

  const repository = fakeRepository({
    computeStats(namedMatrices) {
      receivedArg = namedMatrices;

      return { max: 1 } as StatsResult;
    },
  });

  const service = new StatsService(repository);
  const q = [[1]];
  const r = [[2]];

  const result = service.computeStats(q, r);

  assert.deepEqual(receivedArg, { q, r });
  assert.deepEqual(result, { max: 1 });
});

test("computeStats propaga los errores que lanza el repository", () => {
  const repository = fakeRepository({
    computeStats() {
      throw new Error("matriz inválida");
    },
  });

  const service = new StatsService(repository);

  assert.throws(
    () => service.computeStats([[1]], [[2]]),
    /matriz inválida/,
  );
});
