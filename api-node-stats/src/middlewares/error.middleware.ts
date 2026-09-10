import { type NextFunction, type Request, type Response } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(`Error: ${err.message}`);

  res.status(req.statusCode || 500).json({
    status: "Error",
    message: err.message || "Error interno del servidor",
  });
};
