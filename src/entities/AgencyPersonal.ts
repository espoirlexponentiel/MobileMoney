import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Agency } from "./Agency";
import { Personal } from "./Personal";

@Entity("agency_personal")
export class AgencyPersonal {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Agency)
  agency!: Agency;

  @ManyToOne(() => Personal)
  personal!: Personal;
}
