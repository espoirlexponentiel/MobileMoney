import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

export const AuthService = {
  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  },

  async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  },

  generateToken(payload: { id: number; role: string }) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  }
};
