import { type Request, type Response } from "express";
import { StatsService } from "../services/stats.service.js";
import { type RequestWithStats } from "../types/index.js";

export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  computeStats = (req: RequestWithStats, res: Response) => {
    const { q, r } = req.body ?? {};

    if (!q || !r) {
      return res
        .status(400)
        .json({ error: "Se requieren las matrices 'q' y 'r'" });
    }

    try {
      const stats = this.statsService.computeStats(q, r);

      return res.status(200).json(stats);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Error desconocido al calcular estadísticas";

      return res.status(422).json({ error: message });
    }
  };
}
