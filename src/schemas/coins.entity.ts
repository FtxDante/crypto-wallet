import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
}
