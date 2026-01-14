import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { Agency } from "./Agency";
import { Personal } from "./Personal";

@Entity("agency_personal")
export class AgencyPersonal {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Agency, agency => agency.agencyPersonals, { onDelete: "CASCADE" })
  agency!: Agency;

  @ManyToOne(() => Personal, personal => personal.agencyPersonals, { onDelete: "CASCADE" })
  personal!: Personal;

  @CreateDateColumn()
  assigned_at!: Date;
}
