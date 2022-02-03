import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coins } from '../schemas/coins.entity';
import { FindACoin } from '../utils/interfaces/findACoin';
import { WalletFunds } from '../utils/interfaces/walletFounds';
import { ApiCoinsService } from './api-axios.service';
import { TransactionsService } from './transactions.service';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(Coins)
    private coinsRepository: Repository<Coins>,
    private apiService: ApiCoinsService,
    private transactionsServices: TransactionsService,
  ) {}

  public async createCoin(
    currentCoin: string,
    quoteTo: string,
    ownerId: string,
  ) {
    const { codein, fullname } = await this.apiService.getCoinInfo(
      currentCoin,
      quoteTo,
    );
    const coin = this.coinsRepository.create({
      coin: codein,
      fullname,
      ownerId,
    });
    return await this.saveACoin(coin);
  }

  public async updateFunds(ownerId: string, payload: WalletFunds) {
    const { cotation } = await this.apiService.getCoinInfo(
      payload.currentCoin,
      payload.quoteTo,
    );

    const coinQuote = await this.createACoinIfNotExists(
      payload.currentCoin,
      payload.quoteTo,
      ownerId,
    );

    if (payload.value < 0) {
      const withdrawal = (payload.value * -1) / cotation;
      if (coinQuote.amont < withdrawal) {
        throw new BadRequestException('You not have money enough');
      }
      coinQuote.amont -= withdrawal;
    } else {
      const cotationValueDeposit = payload.value * cotation;
      coinQuote.amont += cotationValueDeposit;
    }

    await this.saveACoin(coinQuote);
    return await this.transactionsServices.createTransaction(
      payload.value * cotation,
      coinQuote.id,
      ownerId,
      ownerId,
      cotation,
    );
  }

  async createACoinIfNotExists(
    currentCoin: string,
    quoteTo: string,
    ownerId: string,
  ) {
    let coinQuote = await this.coinsRepository.findOne({
      where: { ownerId, coin: quoteTo },
    });

    if (!coinQuote) {
      coinQuote = await this.createCoin(currentCoin, quoteTo, ownerId);
    }
    return coinQuote;
  }

  async findACoin(where: FindACoin) {
    return this.coinsRepository.findOne(where);
  }

  async saveACoin(coin: Coins) {
    return this.coinsRepository.save(coin);
  }
}
