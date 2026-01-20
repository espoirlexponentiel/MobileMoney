import { Response } from "express";
import { AgenciesService } from "../../services/agenciesServices";
import { AuthRequest } from "../../middleware/authRequest";

// Types pour body et params
interface CreateAgencyBody {
  name: string;
  businessId: number;
  countryId: number;
}

interface UpdateAgencyBody {
  name?: string;
  businessId?: number;
  countryId?: number;
}

interface AgencyParams {
  id: string;
}

export const AgenciesController = {
  // ✅ Créer une agence
  async create(req: AuthRequest<CreateAgencyBody>, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "Utilisateur non authentifié" });

      const { name, businessId, countryId } = req.body;
      const managerUserId = req.user.id; // 🔹 On prend le manager connecté

      const agency = await AgenciesService.createAgency(name, businessId, countryId, managerUserId);
      res.status(201).json(agency);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  // ✅ Récupérer toutes les agences
  async getAll(req: AuthRequest, res: Response) {
    const agencies = await AgenciesService.getAllAgencies();
    res.json(agencies);
  },

  // ✅ Récupérer une agence par ID
  async getOne(req: AuthRequest<any, AgencyParams>, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID invalide" });

    const agency = await AgenciesService.getAgencyById(id);
    if (!agency) return res.status(404).json({ error: "Agence introuvable" });

    res.json(agency);
  },

  // ✅ Mettre à jour une agence
  async update(req: AuthRequest<UpdateAgencyBody, AgencyParams>, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "ID invalide" });

      const agency = await AgenciesService.updateAgency(id, req.body);
      res.json(agency);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  // ✅ Supprimer une agence
  async delete(req: AuthRequest<{}, AgencyParams>, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "ID invalide" });

      const result = await AgenciesService.deleteAgency(id);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
