import { Router, Response } from "express";
import { PersonalTransactionsController } from "../../controllers/personal/transactions";
import { authMiddleware } from "../../middleware/auth";
import { requireRole } from "../../middleware/role";
import { AuthRequest } from "../../middleware/authRequest";

const router = Router();

// ✅ Wrapper standard pour AuthRequest
const wrapAuth = <BodyType = any>(
  handler: (req: AuthRequest<BodyType>, res: Response) => Promise<any>
) => (req: AuthRequest<BodyType>, res: Response) =>
  handler(req, res);

// ✅ Dépôt (agent → client)
router.post(
  "/deposit",
  authMiddleware,
  requireRole(["personal"]),
  wrapAuth(PersonalTransactionsController.deposit)
);

// ✅ Retrait (client → agent)
router.post(
  "/withdraw",
  authMiddleware,
  requireRole(["personal"]),
  wrapAuth(PersonalTransactionsController.withdraw)
);

// ✅ Historique des transactions de l’agent
router.get(
  "/history",
  authMiddleware,
  requireRole(["personal"]),
  wrapAuth(PersonalTransactionsController.history)
);

export default router;
