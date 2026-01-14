import { Router } from "express";
import { PersonalsController } from "../../controllers/manager/personals";
import { authMiddleware } from "../../middleware/auth";
import { requireRole } from "../../middleware/role";

const router = Router();

// ✅ Affecter un Personal à une Agency
router.post("/assign", authMiddleware, requireRole(["manager"]), PersonalsController.assign);

// ✅ Récupérer tous les Personals d’une Agency
router.get("/agency/:agencyId", authMiddleware, requireRole(["manager", "admin"]), PersonalsController.getByAgency);

// ✅ Retirer un Personal d’une Agency
router.delete("/unassign", authMiddleware, requireRole(["manager"]), PersonalsController.unassign);

export default router;
