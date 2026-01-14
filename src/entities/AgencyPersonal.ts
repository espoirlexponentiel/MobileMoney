import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany } from "typeorm";
import { Agency } from "./Agency";
import { Personal } from "./Personal";
import { Deposit } from "./Deposit";
import { Withdraw } from "./Withdraw";
import { Transaction } from "./Transaction";

@Entity("agency_personal")
export class AgencyPersonal {
  @PrimaryGeneratedColumn()
  id!: number;

  // ✅ Relation avec l’agence
  @ManyToOne(() => Agency, agency => agency.agencyPersonals, { onDelete: "CASCADE" })
  agency!: Agency;

  // ✅ Relation avec le personal (agent)
  @ManyToOne(() => Personal, personal => personal.agencyPersonals, { onDelete: "CASCADE" })
  personal!: Personal;

  @CreateDateColumn()
  assigned_at!: Date;

  // ✅ Relations inverses pour auditabilité
  @OneToMany(() => Deposit, deposit => deposit.agency_personal)
  deposits!: Deposit[];

  @OneToMany(() => Withdraw, withdraw => withdraw.agency_personal)
  withdraws!: Withdraw[];

  @OneToMany(() => Transaction, transaction => transaction.agency_personal)
  transactions!: Transaction[];
}
