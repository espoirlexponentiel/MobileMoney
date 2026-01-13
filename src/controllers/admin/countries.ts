import { Request, Response } from "express";
import { Country } from "../../entities";
import { AppDataSource } from "../../data-source";


export const CountryController = {
  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const repo = AppDataSource.getRepository(Country);
      const country = repo.create({ name });
      await repo.save(country);
      res.status(201).json(country);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Country);
    const countries = await repo.find({ relations: ["networks", "agencies"] });
    res.json(countries);
  },

  async delete(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Country);
    const { id } = req.params;
    await repo.delete(id);
    res.json({ message: "Country supprimé" });
  }
};
