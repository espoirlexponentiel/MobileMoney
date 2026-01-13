import { Request, Response } from "express";
import { Country, Network } from "../../entities";
import { AppDataSource } from "../../data-source";


export const NetworkController = {
  async create(req: Request, res: Response) {
    try {
      const { name, countryId } = req.body;
      const countryRepo = AppDataSource.getRepository(Country);
      const networkRepo = AppDataSource.getRepository(Network);

      const country = await countryRepo.findOneBy({ country_id: countryId });
      if (!country) return res.status(404).json({ error: "Country introuvable" });

      const network = networkRepo.create({ name, country });
      await networkRepo.save(network);
      res.status(201).json(network);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Network);
    const networks = await repo.find({ relations: ["country"] });
    res.json(networks);
  },

  async delete(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Network);
    const { id } = req.params;
    await repo.delete(id);
    res.json({ message: "Network supprimé" });
  }
};
