export class CreateTransactionDto {
  readonly receiverAddress: string;
  readonly quoteTo: string;
  readonly currentCoin: string;
  readonly value: number;
}
