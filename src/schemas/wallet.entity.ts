import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  adress: string;

  @Column()
  name: string;

  @Column()
  cpf: string;

  @Column('timestamptz')
  birthdate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
