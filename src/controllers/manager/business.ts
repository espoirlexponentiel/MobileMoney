import { Request, Response } from "express";
import { BusinessService } from "../../services/businessServices";

export const BusinessController = {
  async create(req: Request, res: Response) {
    try {
      const { name, managerId } = req.body;
      const business = await BusinessService.createBusiness(name, managerId);
      res.status(201).json(business);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    const businesses = await BusinessService.getAllBusinesses();
    res.json(businesses);
  },

  async getOne(req: Request, res: Response) {
    const business = await BusinessService.getBusinessById(Number(req.params.id));
    if (!business) return res.status(404).json({ error: "Business introuvable" });
    res.json(business);
  },

  async update(req: Request, res: Response) {
    try {
      const business = await BusinessService.updateBusiness(Number(req.params.id), req.body);
      res.json(business);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const result = await BusinessService.deleteBusiness(Number(req.params.id));
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
};
