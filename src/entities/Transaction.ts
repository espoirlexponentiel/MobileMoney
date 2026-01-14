import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Wallet } from "./Wallet";
import { AgencyPersonal } from "./AgencyPersonal";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn({ name: "transaction_id" })
  transaction_id!: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, { onDelete: "CASCADE" })
  wallet!: Wallet;

  @ManyToOne(() => AgencyPersonal, (ap) => ap.transactions, { onDelete: "CASCADE" })
  agency_personal!: AgencyPersonal;

  // ✅ Type d’opération : dépôt, retrait ou ravitaillement
  @Column({ type: "enum", enum: ["deposit", "withdraw", "topup"] })
  type!: string;

  @Column({ type: "float" })
  amount!: number;

  @Column({
    type: "enum",
    enum: ["success", "pending", "failed"],
    default: "pending",
  })
  status!: string;

  // ✅ Numéro du client (obligatoire)
  @Column({ name: "client_phone", length: 20 })
  clientPhone!: string;

  // ✅ Nom du client (optionnel)
  @Column({ name: "client_name", nullable: true })
  clientName?: string;

  // ✅ Nouveau champ : code USSD généré automatiquement
  @Column({ name: "ussd_code", type: "varchar", length: 120, nullable: true })
  ussdCode?: string;

  @CreateDateColumn()
  created_at!: Date;
}
