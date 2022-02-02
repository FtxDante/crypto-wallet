import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CoinsInfo, CoinsInfoHandled } from '../utils/interfaces/coinsInfos';

@Injectable()
export class ApiCoinsService {
  constructor(private httpService: HttpService) {}

  async getCoinInfo(
    currentCoin: string,
    quoteTo: string,
  ): Promise<CoinsInfoHandled> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `https://economia.awesomeapi.com.br/json/last/${currentCoin}-${quoteTo}`,
        ),
      );

      return this.coinInfoHandler(data[currentCoin + quoteTo]);
    } catch (error) {
      throw new NotFoundException(
        `Inexistent or unsupported transaction ${currentCoin}-${quoteTo}`,
      );
    }
  }

  private async coinInfoHandler({ code, codein, name, ask }: CoinsInfo) {
    const [, fullname] = name.split('/');
    return {
      code,
      codein,
      fullname,
      cotation: ask,
    };
  }
}
