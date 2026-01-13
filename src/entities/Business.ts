import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Manager } from "./Manager";
import { Agency } from "./Agency";

@Entity("businesses")
export class Business {
  @PrimaryGeneratedColumn({ name: "business_id" })
  business_id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => Manager, manager => manager.businesses)
  manager!: Manager;

  @OneToMany(() => Agency, agency => agency.business)
  agencies!: Agency[];

  @CreateDateColumn()
  created_at!: Date;
}
