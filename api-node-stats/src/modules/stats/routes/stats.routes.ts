import { Router } from "express";
import { errorHandler } from "../../../middlewares/error.middleware.js";
import { StatsController } from "../controllers/stats.controller.js";
import { StatsRepository } from "../repositories/stats.repository.js";
import { StatsService } from "../services/stats.service.js";

const router = Router();

const statsRepository = new StatsRepository();
const statsService = new StatsService(statsRepository);
const statsController = new StatsController(statsService);

router.post("/stats", statsController.computeStats);

router.use(errorHandler);

export default router;
