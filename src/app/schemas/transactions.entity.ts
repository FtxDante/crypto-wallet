import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Coins } from './coins.entity';
import { Wallet } from './wallet.entity';

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column('double precision')
  value: number;

  @Column('timestamptz')
  dateTime: Date;

  @Column()
  @Exclude()
  coinId: string;

  @ManyToOne(() => Coins, (coin) => coin.id)
  @JoinColumn({ name: 'coinId' })
  coin: Coins;

  @Column()
  sendTo: string;

  @Column()
  receiveFrom: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.address)
  @JoinColumn({ name: 'sentTo' })
  sendToWallet: Wallet;

  @ManyToOne(() => Wallet, (wallet) => wallet.address)
  @JoinColumn({ name: 'receiveFrom' })
  receiveFromWallet: Wallet;

  @Column('double precision')
  currentCotation: number;
}
