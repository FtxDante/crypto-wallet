import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Coins {
  @PrimaryGeneratedColumn()
  adress: string;
}
