import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn({name: 'user_id'})
  user_id!: number;

  @Column({name: 'first_name'})
  firstName!: string;

  @Column({name: 'phone', unique: true})
  phone!: string;

  @Column({name: 'email', unique: true, nullable: false})
  email!: string;

  @Column()
  password_hash!: string;

  @Column({ type: "enum", enum: ["admin", "manager", "personal"] })
  role!: string;

  @CreateDateColumn()
  created_at!: Date;
}
