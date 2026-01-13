import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Business } from "./Business";
import { Agency } from "./Agency";
import { Network } from "./Network";

@Entity("wallets")
export class Wallet {
  @PrimaryGeneratedColumn({ name: "wallet_id" })
  wallet_id!: number;

  @ManyToOne(() => Business, { nullable: true })
  business?: Business;

  @ManyToOne(() => Agency)
  agency!: Agency;

  @ManyToOne(() => Network)
  network!: Network;

  @Column({ type: "float", default: 0 })
  balance!: number;

  @CreateDateColumn()
  created_at!: Date;
}
