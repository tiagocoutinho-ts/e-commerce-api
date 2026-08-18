import { Request, Response, NextFunction } from "express";

export function ensureAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if ((req as any).user?.role !== "admin") {
    return res.status(403).json({ error: "Acesso negado. Apenas administradores." });
  }

  return next();
}