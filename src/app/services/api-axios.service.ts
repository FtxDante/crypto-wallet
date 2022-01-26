import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CoinsInfo, CoinsInfoHandled } from '../utils/interfaces/coinsInfos';

@Injectable()
export class ApiCoinsService {
  private detailsInfoCoins: CoinsInfo[];
  private availableCoins: object[];
  constructor(private httpService: HttpService) {}

  async getCoinInfo(
    currentCoin: string,
    quoteTo = 'BRL',
  ): Promise<CoinsInfoHandled> {
    try {
      this.detailsInfoCoins = [];
      const result = this.httpService.get(
        `https://economia.awesomeapi.com.br/last/${currentCoin}-${quoteTo}`,
      );
      await result.forEach((item) => this.detailsInfoCoins.push(item.data));
      return this.handlerCoinInfo(Object.values(this.detailsInfoCoins[0])[0]);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  private async handlerCoinInfo({
    code,
    codein,
    name,
    ask,
  }: CoinsInfo): Promise<CoinsInfoHandled> {
    const [fullname, fullname2] = name.split('/');
    return {
      code,
      codein,
      fullname,
      fullname2,
      cotation: ask,
    };
  }
}
