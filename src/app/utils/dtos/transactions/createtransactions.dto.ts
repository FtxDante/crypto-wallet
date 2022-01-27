export class CreateTransactionDto {
  readonly value: number;
  readonly dateTime: Date;
  readonly sendTo: string;
  readonly coindId: string;
  readonly receiveFrom: string;
  readonly currentCotation: number;
}
