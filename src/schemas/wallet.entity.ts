import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Coins } from './coins.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  address: string;

  @Column()
  name: string;

  @Column({ unique: true })
  cpf: string;

  @Column({ type: 'date' })
  birthday: Date;

  @OneToMany(() => Coins, (coins) => coins.owner, {
    eager: true,
  })
  coins: Coins[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;
}
