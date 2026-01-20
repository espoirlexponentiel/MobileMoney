import { AppDataSource } from "../data-source";
import { Deposit } from "../entities/Deposit";
import { Withdraw } from "../entities/Withdraw";
import { Transaction } from "../entities/Transaction";
import { Wallet } from "../entities/Wallet";
import { AgencyPersonal } from "../entities/AgencyPersonal";
import { UserRole } from "../types/auth";

interface DepositPayload {
  walletId: number;
  amount: number;
  clientPhone: string;
  clientName?: string;
}

interface WithdrawPayload {
  walletId: number;
  amount: number;
  clientPhone: string;
  clientName?: string;
}

interface TopupPayload {
  walletId: number;
  amount: number;
  secretCode?: number;
}

interface AuthUser {
  id: number;
  role: UserRole;
}

export const TransactionsService = {
  // ======================================================
  // 🔹 DEPOT (personal → client)
  // ======================================================
  async createDeposit(payload: DepositPayload, user: AuthUser) {
    if (user.role !== "personal") {
      throw new Error("Seul un personal peut effectuer un dépôt");
    }

    const { walletId, amount, clientPhone, clientName } = payload;

    if (amount <= 0) throw new Error("Montant invalide");

    const walletRepo = AppDataSource.getRepository(Wallet);
    const apRepo = AppDataSource.getRepository(AgencyPersonal);
    const depositRepo = AppDataSource.getRepository(Deposit);
    const transactionRepo = AppDataSource.getRepository(Transaction);

    // 🔹 Wallet + agence + réseau
    const wallet = await walletRepo.findOne({
      where: { wallet_id: walletId },
      relations: ["agency", "network"],
    });
    if (!wallet) throw new Error("Wallet introuvable");

    // 🔹 Vérifier que le personal appartient à l'agence du wallet
    const agencyPersonal = await apRepo.findOne({
      where: {
        personal: { personal_id: user.id },
        agency: { agency_id: wallet.agency.agency_id },
      },
      relations: ["agency", "personal"],
    });

    if (!agencyPersonal) {
      throw new Error("Personal non lié à l'agence du wallet");
    }

    if (wallet.balance < amount) {
      throw new Error("Solde insuffisant");
    }

    // 🔹 Mise à jour du solde
    wallet.balance -= amount;
    await walletRepo.save(wallet);

    // 🔹 Génération USSD
    const secretStr = wallet.secretCode?.toString() ?? "0000";
    const network = wallet.network.name.toLowerCase();

    let ussdCode: string | undefined;
    if (network === "yas") {
      ussdCode = `*145*1*${amount}*${clientPhone}*${secretStr}#`;
    } else if (network === "moov africa") {
      ussdCode = `*152*1*1*${clientPhone}*${amount}*${secretStr}#`;
    }

    // 🔹 Dépôt
    const deposit = depositRepo.create({
      wallet,
      agency_personal: agencyPersonal,
      amount,
      clientPhone,
      clientName,
      status: "success",
    });
    await depositRepo.save(deposit);

    // 🔹 Transaction
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

  // ======================================================
  // 🔹 RETRAIT (client → personal)
  // ======================================================
  async createWithdraw(payload: WithdrawPayload, user: AuthUser) {
    if (user.role !== "personal") {
      throw new Error("Seul un personal peut effectuer un retrait");
    }

    const { walletId, amount, clientPhone, clientName } = payload;
    if (amount <= 0) throw new Error("Montant invalide");

    const walletRepo = AppDataSource.getRepository(Wallet);
    const apRepo = AppDataSource.getRepository(AgencyPersonal);
    const withdrawRepo = AppDataSource.getRepository(Withdraw);
    const transactionRepo = AppDataSource.getRepository(Transaction);

    const wallet = await walletRepo.findOne({
      where: { wallet_id: walletId },
      relations: ["agency", "network"],
    });
    if (!wallet) throw new Error("Wallet introuvable");

    const agencyPersonal = await apRepo.findOne({
      where: {
        personal: { personal_id: user.id },
        agency: { agency_id: wallet.agency.agency_id },
      },
      relations: ["agency", "personal"],
    });

    if (!agencyPersonal) {
      throw new Error("Personal non lié à l'agence du wallet");
    }

    wallet.balance += amount;
    await walletRepo.save(wallet);

    // 🔹 USSD
    const secretStr = wallet.secretCode?.toString() ?? "0000";
    const network = wallet.network.name.toLowerCase();

    let ussdCode: string | undefined;
    if (network === "moov africa") {
      ussdCode = `*152*2*1*${clientPhone}*${amount}*${secretStr}#`;
    } else if (network === "yas") {
      ussdCode = `YAS-RETRAIT: ${clientPhone} / ${amount} / ${secretStr}`;
    }

    const withdraw = withdrawRepo.create({
      wallet,
      agency_personal: agencyPersonal,
      amount,
      clientPhone,
      clientName,
      status: "success",
    });
    await withdrawRepo.save(withdraw);

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

  // ======================================================
  // 🔹 TOPUP (manager → wallet)
  // ======================================================
  async createTopup(payload: TopupPayload, user: AuthUser) {
    if (user.role !== "manager") {
      throw new Error("Seul un manager peut effectuer un topup");
    }

    const { walletId, amount, secretCode } = payload;
    if (amount <= 0) throw new Error("Montant invalide");

    const walletRepo = AppDataSource.getRepository(Wallet);
    const transactionRepo = AppDataSource.getRepository(Transaction);

    const wallet = await walletRepo.findOne({
      where: { wallet_id: walletId },
      relations: ["agency", "agency.manager", "network"],
    });
    if (!wallet) throw new Error("Wallet introuvable");

    // 🔹 Vérification du manager propriétaire
    if (wallet.agency.manager.manager_id !== user.id) {
      throw new Error("Manager non autorisé sur ce wallet");
    }

    wallet.balance += amount;
    if (secretCode !== undefined) {
      wallet.secretCode = secretCode;
    }
    await walletRepo.save(wallet);

    const secretStr = wallet.secretCode?.toString() ?? "0000";
    const ussdCode = `TOPUP-${wallet.network.name}-${amount}-${secretStr}`;

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

  // ======================================================
  // 🔹 HISTORIQUE DU PERSONAL
  // ======================================================
  async getPersonalTransactions(user: AuthUser) {
    if (user.role !== "personal") {
      throw new Error("Seul un personal peut consulter son historique");
    }

    const transactionRepo = AppDataSource.getRepository(Transaction);

    return transactionRepo.find({
      where: {
        agency_personal: {
          personal: { personal_id: user.id },
        },
      },
      relations: ["wallet"],
      order: { created_at: "DESC" },
    });
  },
};
