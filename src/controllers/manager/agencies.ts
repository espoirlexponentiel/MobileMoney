import { Request, Response } from "express";
import { AgenciesService } from "../../services/agenciesServices";

export const AgenciesController = {
  async create(req: Request, res: Response) {
    try {
      const { name, businessId, countryId, managerId } = req.body;
      
      const agency = await AgenciesService.createAgency(name, businessId, countryId, managerId);
      res.status(201).json(agency);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    const agencies = await AgenciesService.getAllAgencies();
    res.json(agencies);
  },

  async getOne(req: Request, res: Response) {
    const agency = await AgenciesService.getAgencyById(Number(req.params.id));
    if (!agency) return res.status(404).json({ error: "Agence introuvable" });
    res.json(agency);
  },

  async update(req: Request, res: Response) {
    try {
      const agency = await AgenciesService.updateAgency(Number(req.params.id), req.body);
      res.json(agency);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const result = await AgenciesService.deleteAgency(Number(req.params.id));
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
};
