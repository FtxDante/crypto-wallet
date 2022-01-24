import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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

  @Column('timestamptz')
  birthdate: Date;

  @ManyToOne(() => Coins, (coins) => coins.owner)
  coins: Coins[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
