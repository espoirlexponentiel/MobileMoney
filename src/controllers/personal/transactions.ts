import { Request, Response } from "express";
import { TransactionsService } from "../../services/transactionsServices";


export const PersonalTransactionsController = {
  // ✅ Dépôt (agent → client)
  async deposit(req: Request, res: Response) {
    try {
      const { walletId, agencyPersonalId, amount, clientPhone, clientName } = req.body;

      const result = await TransactionsService.createDeposit({
        walletId,
        agencyPersonalId,
        amount,
        clientPhone,
        clientName,
      });

      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  // ✅ Retrait (client → agent)
  async withdraw(req: Request, res: Response) {
    try {
      const { walletId, agencyPersonalId, amount, clientPhone, clientName } = req.body;

      const result = await TransactionsService.createWithdraw({
        walletId,
        agencyPersonalId,
        amount,
        clientPhone,
        clientName,
      });

      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  // ✅ Historique des transactions de l’agent
  async history(req: Request, res: Response) {
    try {
      const { agencyPersonalId } = req.body;

      const result = await TransactionsService.getPersonalTransactions(agencyPersonalId);

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
