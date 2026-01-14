import { Request, Response } from "express";
import { PersonalsService } from "../../services/personalsService";

export const PersonalsController = {
  // ✅ Affecter un Personal existant à une Agency
  async assign(req: Request, res: Response) {
    try {
      const { personalId, agencyId } = req.body;
      const assignment = await PersonalsService.assignPersonalToAgency(personalId, agencyId);
      res.status(201).json(assignment);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  // ✅ Récupérer tous les Personals d’une Agency
  async getByAgency(req: Request, res: Response) {
    try {
      const personals = await PersonalsService.getPersonalsByAgency(Number(req.params.agencyId));
      res.json(personals);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  // ✅ Retirer un Personal d’une Agency
  async unassign(req: Request, res: Response) {
    try {
      const { personalId, agencyId } = req.body;
      const result = await PersonalsService.unassignPersonalFromAgency(personalId, agencyId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
};
