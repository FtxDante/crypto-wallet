import { Type } from 'class-transformer';
import { Length, Matches, MaxDate } from 'class-validator';
export class CreateWalletDto {
  @Length(5, 50)
  readonly name: string;

  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)
  readonly cpf: string;

  @MaxDate(new Date())
  @Type(() => Date)
  readonly birthday: Date;
}
