import { Router } from "express";
import { BusinessController } from "../../controllers/manager/business";
import { authMiddleware } from "../../middleware/auth";
import { requireRole } from "../../middleware/role";

const router = Router();

// ✅ CRUD Business par Manager
router.post("/", authMiddleware, requireRole(["manager"]), BusinessController.create);
router.get("/", authMiddleware, requireRole(["manager", "admin"]), BusinessController.getAll);
router.get("/:id", authMiddleware, requireRole(["manager", "admin"]), BusinessController.getOne);
router.put("/:id", authMiddleware, requireRole(["manager"]), BusinessController.update);
router.delete("/:id", authMiddleware, requireRole(["manager"]), BusinessController.delete);

export default router;
