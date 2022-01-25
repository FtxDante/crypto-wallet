import {
  Column,
  Entity,
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

  @Column('double precision')
  amont: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.coins)
  owner: Wallet;

  @OneToMany(() => Transactions, (transactions) => transactions.id)
  transactions: Transactions[];
}
