import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { env } from "./src/config/env.js";
import statsRoutes from "./src/modules/stats/routes/stats.routes.js";

const app: Application = express();

app.use(express.json());

app.use("/api", [statsRoutes]);

app.get("/health", (_req: Request, res: Response) =>
  res.json({
    status: "ok",
  }),
);

app.listen(env.port, () => {
  console.log("🚀 Servidor escuchando en el puerto:", env.port);
});
