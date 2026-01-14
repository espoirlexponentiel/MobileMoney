import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Wallet } from "./Wallet";
import { AgencyPersonal } from "./AgencyPersonal";

@Entity("withdraws")
export class Withdraw {
  @PrimaryGeneratedColumn({ name: "withdraw_id" })
  withdraw_id!: number;

  @ManyToOne(() => Wallet, wallet => wallet.withdraws, { onDelete: "CASCADE" })
  wallet!: Wallet;

  @ManyToOne(() => AgencyPersonal, ap => ap.withdraws, { onDelete: "CASCADE" })
  agency_personal!: AgencyPersonal;

  @Column({ type: "float" })
  amount!: number;

  @Column({ type: "enum", enum: ["success", "pending", "failed"], default: "pending" })
  status!: string;

  @Column({ name: "client_phone", length: 20 })
  clientPhone!: string;

  @Column({ name: "client_name", nullable: true })
  clientName?: string;

  @CreateDateColumn()
  created_at!: Date;
}
