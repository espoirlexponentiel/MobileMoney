import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Admin } from "../entities/Admin";
import { Manager } from "../entities/Manager";
import { Personal } from "../entities/Personal";
import { AuthService } from "../services/authService";

export const AuthController = {
  // 1️⃣ Création Admin
  async signupAdmin(req: Request, res: Response) {
    try {
      const userRepo = AppDataSource.getRepository(User);
      const adminRepo = AppDataSource.getRepository(Admin);

      const { firstName, phone, email, password } = req.body;
      const hashedPassword = await AuthService.hashPassword(password);

      const user = userRepo.create({
        firstName,
        phone,
        email,
        password_hash: hashedPassword,
        role: "admin",
      });
      await userRepo.save(user);

      const admin = adminRepo.create({ user });
      await adminRepo.save(admin);

      return res.status(201).json({ user, admin });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 2️⃣ Connexion (Admin, Manager, Personal)
  async login(req: Request, res: Response) {
    try {
      const userRepo = AppDataSource.getRepository(User);
      const { phone, password } = req.body;

      const user = await userRepo.findOne({ where: { phone } });
      if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

      const valid = await AuthService.comparePassword(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: "Mot de passe incorrect" });

      const token = AuthService.generateToken({ id: user.user_id, role: user.role });
      return res.json({ token, role: user.role });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 3️⃣ Création Manager par Admin
  async createManager(req: Request, res: Response) {
    try {
      const userRepo = AppDataSource.getRepository(User);
      const managerRepo = AppDataSource.getRepository(Manager);
      const adminRepo = AppDataSource.getRepository(Admin);

      const { firstName, phone, email, password, adminId } = req.body;

      const hashedPassword = await AuthService.hashPassword(password);
      const user = userRepo.create({
        firstName,
        phone,
        email,
        password_hash: hashedPassword,
        role: "manager",
      });
      await userRepo.save(user);

      const admin = await adminRepo.findOneBy({ admin_id: adminId });
      if (!admin) return res.status(404).json({ error: "Admin introuvable" });

      const manager = managerRepo.create({ user, admin });
      await managerRepo.save(manager);

      return res.status(201).json({ user, manager });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 4️⃣ Création Agent par Manager
  async createAgent(req: Request, res: Response) {
    try {
      const userRepo = AppDataSource.getRepository(User);
      const personalRepo = AppDataSource.getRepository(Personal);
      const managerRepo = AppDataSource.getRepository(Manager);

      const { firstName, phone, email, password, managerId } = req.body;

      const hashedPassword = await AuthService.hashPassword(password);
      const user = userRepo.create({
        firstName,
        phone,
        email,
        password_hash: hashedPassword,
        role: "personal",
      });
      await userRepo.save(user);

      const manager = await managerRepo.findOneBy({ manager_id: managerId });
      if (!manager) return res.status(404).json({ error: "Manager introuvable" });

      const personal = personalRepo.create({ user, manager });
      await personalRepo.save(personal);

      return res.status(201).json({ user, personal });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  },
};
