import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

export type UserRole = "admin" | "manager" | "personal";

export interface TokenPayload {
  id: number;      // users.id
  role: UserRole;
}

export const AuthService = {
  /**
   * Hash un mot de passe
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  },

  /**
   * Compare un mot de passe avec un hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },

  /**
   * Génère un token JWT universel
   */
  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  },

  /**
   * Vérifie et décode un token JWT
   */
  verifyToken(token: string): TokenPayload {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  },
};
