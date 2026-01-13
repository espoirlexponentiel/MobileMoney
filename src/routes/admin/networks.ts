import { Router } from "express";
import { NetworkController } from "../../controllers/admin/networks";
import { requireRole } from "../../middleware/role";
import { authMiddleware } from "../../middleware/auth";


const router = Router();

// ✅ Seul l’Admin peut gérer les networks
router.post("/", authMiddleware, requireRole(["admin"]), NetworkController.create);
router.get("/", authMiddleware, requireRole(["admin"]), NetworkController.getAll);
router.delete("/:id", authMiddleware, requireRole(["admin"]), NetworkController.delete);

export default router;
