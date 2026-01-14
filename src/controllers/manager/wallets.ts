import { Request, Response } from "express";
import { TransactionsService } from "../../services/transactionsServices";

export const ManagerWalletsController = {
  // ✅ Ravitaillement d’un wallet par le manager (avec mise à jour du code secret)
  async topup(req: Request, res: Response) {
    try {
      const { walletId, managerId, amount, secretCode } = req.body;

      const result = await TransactionsService.createTopup({
        walletId,
        managerId,
        amount,
        secretCode,
      });

      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },}

  // ✅ (Optionnel) Historique des transactions d’un wallet géré par le manager
  
