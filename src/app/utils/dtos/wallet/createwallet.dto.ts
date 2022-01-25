import { Type } from 'class-transformer';
import { IsUUID, Length, Matches, MaxDate, IsOptional } from 'class-validator';

export class CreateWalletDto {
  @Length(7, 50)
  readonly name: string;

  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)
  readonly cpf: string;

  @MaxDate(new Date())
  @Type(() => Date)
  readonly birthdate: Date;

  @IsOptional()
  @IsUUID()
  public coinsId?: string;
}
