import { Exclude } from 'class-transformer';
import {
  Column,
  Double,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transactions } from './transactions.entity';
import { Wallet } from './wallet.entity';

@Entity()
export class Coins {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  coin: string;

  @Column()
  fullname: string;

  @Column({ type: 'double precision', default: 0 })
  amont: number;

  @Column()
  @Exclude()
  ownerId: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.coins)
  @JoinColumn({ name: 'ownerId' })
  owner: Wallet;

  @OneToMany(() => Transactions, (transactions) => transactions.coin, {
    eager: true,
  })
  transactions: Transactions[];
}
