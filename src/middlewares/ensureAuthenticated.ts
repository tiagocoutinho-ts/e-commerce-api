import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ error: "Token de autenticação não fornecido." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    (req as any).user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}