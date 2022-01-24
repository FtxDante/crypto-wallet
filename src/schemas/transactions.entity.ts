import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('double precision')
  value: number;

  @Column('timestamptz')
  dateTime: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.adress)
  sendTo: Wallet;

  @ManyToOne(() => Wallet, (wallet) => wallet.adress)
  receiveFrom: Wallet;

  @Column('double precision')
  currentCotation: number;
}
