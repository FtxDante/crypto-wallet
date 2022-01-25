export class CreateTransactionDto {
  readonly value: number;
  readonly dateTime: Date;
  readonly sendTo: string;
  readonly receiveFrom: string;
  readonly currentCotation: number;
}
