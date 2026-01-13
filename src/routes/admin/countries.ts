import { Router } from "express";
import { CountryController } from "../../controllers/admin/countries";
import { requireRole } from "../../middleware/role";
import { authMiddleware } from "../../middleware/auth";


const router = Router();

// ✅ Seul l’Admin peut gérer les countries
router.post("/", authMiddleware, requireRole(["admin"]), CountryController.create);
router.get("/", authMiddleware, requireRole(["admin"]), CountryController.getAll);
router.delete("/:id", authMiddleware, requireRole(["admin"]), CountryController.delete);

export default router;
