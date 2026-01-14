import { Router } from "express";
import { ManagerWalletsController } from "../../controllers/manager/wallets";
import { authMiddleware } from "../../middleware/auth";
import { requireRole } from "../../middleware/role";

const router = Router();

// ✅ Ravitaillement d’un wallet par le manager
router.post(
  "/topup",
  authMiddleware,
  requireRole(["manager"]),
  ManagerWalletsController.topup
);

// ✅ Historique des transactions d’un wallet (optionnel)


export default router;
