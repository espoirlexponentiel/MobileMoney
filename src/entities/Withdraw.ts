import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Wallet } from "./Wallet";
import { AgencyPersonal } from "./AgencyPersonal";

@Entity("withdraws")
export class Withdraw {
  @PrimaryGeneratedColumn({ name: "withdraw_id" })
  withdraw_id!: number;

  @ManyToOne(() => Wallet)
  wallet!: Wallet;

  @ManyToOne(() => AgencyPersonal)
  agency_personal!: AgencyPersonal;

  @Column({ type: "float" })
  amount!: number;

  @Column({ type: "enum", enum: ["success", "pending", "failed"], default: "pending" })
  status!: string;

  // ✅ Numéro du client (obligatoire)
  @Column({ name: "client_phone", length: 20 })
  clientPhone!: string;

  // ✅ Nom du client (optionnel)
  @Column({ name: "client_name", nullable: true })
  clientName?: string;

  @CreateDateColumn()
  created_at!: Date;
}
