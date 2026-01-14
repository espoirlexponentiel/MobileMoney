import { AppDataSource } from "../data-source";
import { Deposit } from "../entities/Deposit";
import { Withdraw } from "../entities/Withdraw";
import { Transaction } from "../entities/Transaction";
import { Wallet } from "../entities/Wallet";
import { AgencyPersonal } from "../entities/AgencyPersonal";

export const TransactionsService = {
  // ✅ Dépôt (agent → client)
  async createDeposit({ walletId, agencyPersonalId, amount, clientPhone, clientName }: any) {
    const walletRepo = AppDataSource.getRepository(Wallet);
    const depositRepo = AppDataSource.getRepository(Deposit);
    const transactionRepo = AppDataSource.getRepository(Transaction);
    const apRepo = AppDataSource.getRepository(AgencyPersonal);

    const wallet = await walletRepo.findOne({
      where: { wallet_id: walletId },
      relations: ["network"],
    });
    if (!wallet) throw new Error("Wallet introuvable");

    const agencyPersonal = await apRepo.findOneByOrFail({ id: agencyPersonalId });

    if (wallet.balance < amount) throw new Error("Solde insuffisant");

    // ✅ Décrémenter le solde
    wallet.balance -= amount;
    await walletRepo.save(wallet);

    // ✅ Générer le code USSD selon le réseau
    let ussdCode: string | undefined;
    const networkName = wallet.network.name.toLowerCase();

    if (networkName === "yas") {
      ussdCode = `*145*1*${amount}*${clientPhone}*${wallet.secretCode}#`;
    } else if (networkName === "moov africa") {
      ussdCode = `*152*1*1*${clientPhone}*${amount}*${wallet.secretCode}#`;
    }

    // ✅ Créer le dépôt
    const deposit = depositRepo.create({
      wallet,
      agency_personal: agencyPersonal,
      amount,
      clientPhone,
      clientName,
      status: "success",
    });
    await depositRepo.save(deposit);

    // ✅ Créer la transaction
    const transaction = transactionRepo.create({
      wallet,
      agency_personal: agencyPersonal,
      amount,
      clientPhone,
      clientName,
      type: "deposit",
      status: "success",
      ussdCode,
    });
    await transactionRepo.save(transaction);

    return { deposit, transaction, wallet };
  },

  // ✅ Retrait (client → agent)
  async createWithdraw({ walletId, agencyPersonalId, amount, clientPhone, clientName }: any) {
    const walletRepo = AppDataSource.getRepository(Wallet);
    const withdrawRepo = AppDataSource.getRepository(Withdraw);
    const transactionRepo = AppDataSource.getRepository(Transaction);
    const apRepo = AppDataSource.getRepository(AgencyPersonal);

    const wallet = await walletRepo.findOne({
      where: { wallet_id: walletId },
      relations: ["network"],
    });
    if (!wallet) throw new Error("Wallet introuvable");

    const agencyPersonal = await apRepo.findOneByOrFail({ id: agencyPersonalId });

    // ✅ Incrémenter le solde
    wallet.balance += amount;
    await walletRepo.save(wallet);

    // ✅ Générer le code USSD selon le réseau
    let ussdCode: string | undefined;
    const networkName = wallet.network.name.toLowerCase();

    if (networkName === "moov africa") {
      ussdCode = `*152*2*1*${clientPhone}*${amount}*${wallet.secretCode}#`;
    } else if (networkName === "yas") {
      ussdCode = `YAS-RETRAIT: ${clientPhone} / ${amount}`;
    }

    // ✅ Créer le retrait
    const withdraw = withdrawRepo.create({
      wallet,
      agency_personal: agencyPersonal,
      amount,
      clientPhone,
      clientName,
      status: "success",
    });
    await withdrawRepo.save(withdraw);

    // ✅ Créer la transaction
    const transaction = transactionRepo.create({
      wallet,
      agency_personal: agencyPersonal,
      amount,
      clientPhone,
      clientName,
      type: "withdraw",
      status: "success",
      ussdCode,
    });
    await transactionRepo.save(transaction);

    return { withdraw, transaction, wallet };
  },

  // ✅ Ravitaillement (manager → wallet)
  async createTopup({ walletId, managerId, amount, secretCode }: any) {
    const walletRepo = AppDataSource.getRepository(Wallet);
    const transactionRepo = AppDataSource.getRepository(Transaction);

    const wallet = await walletRepo.findOne({
      where: { wallet_id: walletId },
      relations: ["network"],
    });
    if (!wallet) throw new Error("Wallet introuvable");

    // ✅ Incrémenter le solde
    wallet.balance += amount;

    // ✅ Mettre à jour le code secret si fourni
    if (secretCode) {
      wallet.secretCode = secretCode;
    }

    await walletRepo.save(wallet);

    // ✅ Générer un code USSD fictif pour audit
    const ussdCode = `TOPUP-${wallet.network.name}-${amount}-${wallet.secretCode}`;

    // ✅ Créer la transaction
    const transaction = transactionRepo.create({
      wallet,
      amount,
      type: "topup",
      status: "success",
      clientPhone: "N/A",
      clientName: "Manager",
      ussdCode,
    });
    await transactionRepo.save(transaction);

    return { transaction, wallet };
  },

  // ✅ Historique des transactions d’un agent
  async getPersonalTransactions(agencyPersonalId: number) {
    const transactionRepo = AppDataSource.getRepository(Transaction);
    return transactionRepo.find({
      where: { agency_personal: { id: agencyPersonalId } },
      relations: ["wallet"],
      order: { created_at: "DESC" },
    });
  },
};
