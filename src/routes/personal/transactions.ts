import { Router } from "express";
import { PersonalTransactionsController } from "../../controllers/personal/transactions";
import { authMiddleware } from "../../middleware/auth";
import { requireRole } from "../../middleware/role";

const router = Router();

// ✅ Dépôt (agent → client)
router.post(
  "/deposit",
  authMiddleware,
  requireRole(["personal"]),
  PersonalTransactionsController.deposit
);

// ✅ Retrait (client → agent)
router.post(
  "/withdraw",
  authMiddleware,
  requireRole(["personal"]),
  PersonalTransactionsController.withdraw
);

// ✅ Historique des transactions de l’agent
router.get(
  "/history",
  authMiddleware,
  requireRole(["personal"]),
  PersonalTransactionsController.history
);

export default router;
