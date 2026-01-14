import { AppDataSource } from "../data-source";
import { Personal } from "../entities/Personal";
import { Agency } from "../entities/Agency";
import { AgencyPersonal } from "../entities/AgencyPersonal";

export const PersonalsService = {
  // ✅ Affecter un Personal existant à une Agency
  async assignPersonalToAgency(personalId: number, agencyId: number) {
    const personalRepo = AppDataSource.getRepository(Personal);
    const agencyRepo = AppDataSource.getRepository(Agency);
    const agencyPersonalRepo = AppDataSource.getRepository(AgencyPersonal);

    const personal = await personalRepo.findOne({
      where: { personal_id: personalId },
      relations: ["user", "manager"]
    });
    const agency = await agencyRepo.findOneBy({ agency_id: agencyId });

    if (!personal || !agency) throw new Error("Personal ou Agency introuvable");

    // Vérifier si déjà affecté
    const existing = await agencyPersonalRepo.findOne({
      where: { personal: { personal_id: personalId }, agency: { agency_id: agencyId } }
    });
    if (existing) throw new Error("Cet agent est déjà affecté à cette agence");

    const agencyPersonal = agencyPersonalRepo.create({ personal, agency });
    await agencyPersonalRepo.save(agencyPersonal);

    return await agencyPersonalRepo.findOne({
      where: { id: agencyPersonal.id },
      relations: ["personal", "personal.user", "agency"]
    });
  },

  // ✅ Récupérer tous les Personals d’une Agency
  async getPersonalsByAgency(agencyId: number) {
    const repo = AppDataSource.getRepository(AgencyPersonal);
    return repo.find({
      where: { agency: { agency_id: agencyId } },
      relations: ["personal", "personal.user", "agency"]
    });
  },

  // ✅ Retirer un Personal d’une Agency
  async unassignPersonalFromAgency(personalId: number, agencyId: number) {
    const repo = AppDataSource.getRepository(AgencyPersonal);
    const relation = await repo.findOne({
      where: { personal: { personal_id: personalId }, agency: { agency_id: agencyId } }
    });
    if (!relation) throw new Error("Affectation introuvable");
    await repo.remove(relation);
    return { message: "Affectation supprimée" };
  }
};
