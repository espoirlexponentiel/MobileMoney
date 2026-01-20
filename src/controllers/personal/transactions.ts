import { Response } from "express";
import { TransactionsService } from "../../services/transactionsServices";
import { AuthRequest } from "../../middleware/authRequest";

interface DepositBody {
  walletId: number;
  amount: number;
  clientPhone: string;
  clientName?: string;
}

interface WithdrawBody {
  walletId: number;
  amount: number;
  clientPhone: string;
  clientName?: string;
}

export const PersonalTransactionsController = {
  // =========================
  // ✅ DEPOT
  // =========================
  async deposit(req: AuthRequest<DepositBody>, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      const { walletId, amount, clientPhone, clientName } = req.body;

      if (
        !walletId ||
        typeof amount !== "number" ||
        amount <= 0 ||
        !clientPhone
      ) {
        return res.status(400).json({
          error: "walletId, amount (>0) et clientPhone sont requis",
        });
      }

      const result = await TransactionsService.createDeposit(
        { walletId, amount, clientPhone, clientName },
        req.user
      );

      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  },

  // =========================
  // ✅ RETRAIT
  // =========================
  async withdraw(req: AuthRequest<WithdrawBody>, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      const { walletId, amount, clientPhone, clientName } = req.body;

      if (
        !walletId ||
        typeof amount !== "number" ||
        amount <= 0 ||
        !clientPhone
      ) {
        return res.status(400).json({
          error: "walletId, amount (>0) et clientPhone sont requis",
        });
      }

      const result = await TransactionsService.createWithdraw(
        { walletId, amount, clientPhone, clientName },
        req.user
      );

      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  },

  // =========================
  // ✅ HISTORIQUE PERSONAL
  // =========================
  async history(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }

      const result = await TransactionsService.getPersonalTransactions(req.user);

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  },
};
