import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Coins } from './coins.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  adress: string;

  @Column()
  name: string;

  @Column({ unique: true })
  cpf: string;

  @Column({ type: 'date' })
  birthdate: Date;

  @OneToMany(() => Coins, (coins) => coins.owner)
  coins: Coins[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
