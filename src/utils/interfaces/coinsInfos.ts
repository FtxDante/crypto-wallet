export interface CoinsInfo {
  code: string;
  codein: string;
  name: string;
  high: number;
  low: number;
  varBid: number;
  pctChange: number;
  bid: number;
  ask: number;
  timestamp: Date;
  create_date: Date;
}

export interface CoinsInfoHandled {
  code: string;
  codein: string;
  fullname: string;
  cotation: number;
}
