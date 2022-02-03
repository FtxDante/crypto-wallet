import { IsNumber, IsUUID, Length } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  readonly receiverAddress: string;
  @Length(3, 3)
  readonly currentCoin: string;
  @Length(3, 3)
  readonly quoteTo: string;
  @IsNumber()
  readonly value: number;
}
