import { Router } from "express";
import { AgenciesController } from "../../controllers/manager/agencies";
import { authMiddleware } from "../../middleware/auth";
import { requireRole } from "../../middleware/role";

const router = Router();

// ✅ CRUD Agencies
router.post("/", authMiddleware, requireRole(["manager"]), AgenciesController.create);
router.get("/", authMiddleware, requireRole(["manager", "admin"]), AgenciesController.getAll);
router.get("/:id", authMiddleware, requireRole(["manager", "admin"]), AgenciesController.getOne);
router.put("/:id", authMiddleware, requireRole(["manager"]), AgenciesController.update);
router.delete("/:id", authMiddleware, requireRole(["manager"]), AgenciesController.delete);

export default router;
