export class CreateCoinDto {
  readonly coin: string;
  readonly fullname: string;
  readonly amont: number;
  readonly transactionsId?: string;
}
