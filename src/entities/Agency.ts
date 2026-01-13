import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { Business } from "./Business";
import { Country } from "./Country";
import { Wallet } from "./Wallet";
import { Manager } from "./Manager";

@Entity("agencies")
export class Agency {
  @PrimaryGeneratedColumn({ name: "agency_id" })
  agency_id!: number;

  @Column()
  name!: string;

  // ✅ Lien vers le business auquel appartient l’agence
  @ManyToOne(() => Business, business => business.agencies)
  business!: Business;

  // ✅ Lien vers le pays où l’agence est créée
  @ManyToOne(() => Country, country => country.agencies)
  country!: Country;

  // ✅ Lien vers le manager qui a créé l’agence
  @ManyToOne(() => Manager, manager => manager.agencies)
  manager!: Manager;

  // ✅ Les wallets générés automatiquement pour chaque network du country
  @OneToMany(() => Wallet, wallet => wallet.agency)
  wallets!: Wallet[];

  @CreateDateColumn()
    created_at!: Date;
}
