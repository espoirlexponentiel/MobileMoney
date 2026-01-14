import { AppDataSource } from "../data-source";
import { Business } from "../entities/Business";
import { Manager } from "../entities/Manager";

export const BusinessService = {
  // ✅ Créer un business
  async createBusiness(name: string, managerId: number) {
    const managerRepo = AppDataSource.getRepository(Manager);
    const businessRepo = AppDataSource.getRepository(Business);

    const manager = await managerRepo.findOneBy({ manager_id: managerId });
    if (!manager) throw new Error("Manager introuvable");

    const business = businessRepo.create({ name, manager });
    await businessRepo.save(business);

    return await businessRepo.findOne({
      where: { business_id: business.business_id },
      relations: ["manager", "agencies"]
    });
  },

  // ✅ Récupérer tous les businesses
  async getAllBusinesses() {
    const repo = AppDataSource.getRepository(Business);
    return repo.find({ relations: ["manager", "agencies"] });
  },

  // ✅ Récupérer un business par ID
  async getBusinessById(id: number) {
    const repo = AppDataSource.getRepository(Business);
    return repo.findOne({
      where: { business_id: id },
      relations: ["manager", "agencies"]
    });
  },

  // ✅ Modifier un business
  async updateBusiness(id: number, data: Partial<Business>) {
    const repo = AppDataSource.getRepository(Business);
    await repo.update(id, data);
    return repo.findOne({
      where: { business_id: id },
      relations: ["manager", "agencies"]
    });
  },

  // ✅ Supprimer un business
  async deleteBusiness(id: number) {
    const repo = AppDataSource.getRepository(Business);
    await repo.delete(id);
    return { message: "Business supprimé" };
  }
};
