import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { UserRole } from "../types/auth"; // ✅ ton type global pour les rôles

// ✅ Étendre Request pour TypeScript
interface AuthRequest extends Request {
  user?: {
    id: number;
    role: UserRole;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: UserRole; // ✅ utilisation du type UserRole
    };

    req.user = decoded; // ✅ reconnu par TypeScript
    next();
  } catch {
    return res.status(403).json({ error: "Token invalide" });
  }
};
