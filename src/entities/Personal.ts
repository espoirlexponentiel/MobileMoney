import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Manager } from "./Manager";

@Entity("personals")
export class Personal {
  @PrimaryGeneratedColumn({ name: "personal_id" })
  personal_id!: number;

  @ManyToOne(() => User)
  user!: User;

  // ✅ Lien vers le manager qui a créé cet agent
  @ManyToOne(() => Manager, manager => manager.personals)
  manager!: Manager;

  @CreateDateColumn()
  created_at!: Date;
}
