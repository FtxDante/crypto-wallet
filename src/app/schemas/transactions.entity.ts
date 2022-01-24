import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Coins } from './coins.entity';

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('double precision')
  value: number;

  @Column('timestamptz')
  dateTime: Date;

  @ManyToOne(() => Coins, (wallet) => wallet.id)
  sendTo: Coins;

  @ManyToOne(() => Coins, (wallet) => wallet.id)
  receiveFrom: Coins;

  @Column('double precision')
  currentCotation: number;
}
