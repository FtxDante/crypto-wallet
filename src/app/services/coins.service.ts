import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Coins } from '../schemas/coins.entity';
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

  public async createCoin(coinName: string, ownerId: string) {
    const { code, fullname } = await this.apiService.getCoinInfo(
      coinName,
      'BRL',
    );
    const coin = this.coinsRepository.create({
      coin: code,
      fullname,
      ownerId,
    });
    return await this.coinsRepository.save(coin);
  }

  public async updateValues(ownerId: string, payload: WalletFunds) {
    const { cotation } = await this.apiService.getCoinInfo(
      payload.currentCoin,
      payload.quoteTo,
    );

    const { coinCurrent, coinQuote } = await this.createACoinIfNotExists(
      ownerId,
      payload.currentCoin,
      payload.quoteTo,
    );

    if (payload.value < 0) {
      const withdrawal = (payload.value * -1) / cotation;
      if (coinCurrent.amont < withdrawal) {
        throw new BadRequestException('You not have money enough');
      }
      coinCurrent.amont -= withdrawal;
    } else {
      const cotationValueDeposit = payload.value * cotation;
      coinQuote.amont += cotationValueDeposit;
    }
    await this.coinsRepository.save(coinCurrent);
    await this.coinsRepository.save(coinQuote);
    return await this.transactionsServices.createTransaction({
      value: payload.value,
      coinId: coinCurrent.id,
      sendTo: ownerId,
      receiveFrom: ownerId,
      currentCotation: cotation,
    });
  }

  async createACoinIfNotExists(
    ownerId: string,
    currentCoin: string,
    quoteTo: string,
  ) {
    let coinCurrent = await this.coinsRepository.findOne({
      where: { ownerId, coin: currentCoin },
    });

    let coinQuote = await this.coinsRepository.findOne({
      where: { ownerId, coin: quoteTo },
    });

    if (!coinCurrent) {
      coinCurrent = await this.createCoin(currentCoin, ownerId);
    }

    if (!coinQuote) {
      coinQuote = await this.createCoin(quoteTo, ownerId);
    }

    return { coinCurrent, coinQuote };
  }

  async findCoin(where: DeepPartial<Coins>) {
    return await this.coinsRepository.findOne(where);
  }
}
