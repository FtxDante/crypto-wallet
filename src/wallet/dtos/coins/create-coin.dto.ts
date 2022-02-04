import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateCoinDto {
  @IsString()
  @Length(3, 3)
  readonly coin: string;

  @IsString()
  @Length(5, 50)
  readonly fullname: string;

  @IsNumber()
  readonly amont: number;

  @IsString()
  @IsOptional()
  @IsUUID()
  readonly transactionsId?: string;
}
