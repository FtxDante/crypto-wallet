import { IsNumber, IsString, Length } from 'class-validator';

export class WalletFunds {
  @IsString()
  @Length(3, 3)
  readonly quoteTo: string;
  @IsString()
  @Length(3, 3)
  readonly currentCoin: string;
  @IsNumber()
  readonly value: number;
}
