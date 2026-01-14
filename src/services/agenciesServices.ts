import { AppDataSource } from "../data-source";
import { Agency } from "../entities/Agency";
import { Business } from "../entities/Business";
import { Country } from "../entities/Country";
import { Manager } from "../entities/Manager";
import { Wallet } from "../entities/Wallet";
import { Network } from "../entities/Network";

export const AgenciesService = {
  // ✅ Créer une agence avec wallets liés au business
  async createAgency(name: string, businessId: number, countryId: number, managerId: number) {
    const businessRepo = AppDataSource.getRepository(Business);
    const countryRepo = AppDataSource.getRepository(Country);
    const managerRepo = AppDataSource.getRepository(Manager);
    const agencyRepo = AppDataSource.getRepository(Agency);
    const walletRepo = AppDataSource.getRepository(Wallet);
    const networkRepo = AppDataSource.getRepository(Network);

    const business = await businessRepo.findOneBy({ business_id: businessId });
    const country = await countryRepo.findOne({ where: { country_id: countryId }, relations: ["networks"] });
    const manager = await managerRepo.findOneBy({ manager_id: managerId });

    if (!business || !country || !manager) throw new Error("Business, Country ou Manager introuvable");

    // ✅ Création de l’agence
    const agency = agencyRepo.create({ name, business, country, manager });
    await agencyRepo.save(agency);

    // ✅ Création des wallets liés à l’agence ET au business
    const networks = await networkRepo.find({ where: { country: { country_id: countryId } } });
    const wallets = networks.map(network =>
      walletRepo.create({
        balance: 0,
        agency,
        business,   // ✅ lien direct avec le business
        network
      })
    );
    await walletRepo.save(wallets);

    return await agencyRepo.findOne({
      where: { agency_id: agency.agency_id },
      relations: ["wallets", "wallets.network", "wallets.business", "business", "country", "manager"]
    });
  },

  // ✅ Récupérer toutes les agences
  async getAllAgencies() {
    const repo = AppDataSource.getRepository(Agency);
    return repo.find({ relations: ["wallets", "wallets.network", "wallets.business", "business", "country", "manager"] });
  },

  // ✅ Récupérer une agence par ID
  async getAgencyById(id: number) {
    const repo = AppDataSource.getRepository(Agency);
    return repo.findOne({
      where: { agency_id: id },
      relations: ["wallets", "wallets.network", "wallets.business", "business", "country", "manager"]
    });
  },

  // ✅ Modifier une agence
  async updateAgency(id: number, data: Partial<Agency>) {
    const repo = AppDataSource.getRepository(Agency);
    await repo.update(id, data);
    return repo.findOne({
      where: { agency_id: id },
      relations: ["wallets", "wallets.network", "wallets.business", "business", "country", "manager"]
    });
  },

  // ✅ Supprimer une agence
  async deleteAgency(id: number) {
    const repo = AppDataSource.getRepository(Agency);
    await repo.delete(id);
    return { message: "Agence supprimée" };
  }
};
