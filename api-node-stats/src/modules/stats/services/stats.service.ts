import { StatsRepository } from "../repositories/stats.repository.js";
import { type StatsResult } from "../types/index.js";

export class StatsService {
  constructor(private readonly statsRepository: StatsRepository) {}

  computeStats(q: unknown, r: unknown): StatsResult {
    return this.statsRepository.computeStats({ q, r });
  }
}
