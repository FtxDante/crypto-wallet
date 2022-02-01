export interface transaction {
  value: number;
  dateTime?: Date;
  sendTo: string;
  coinId: string;
  receiveFrom: string;
  currentCotation: number;
}
