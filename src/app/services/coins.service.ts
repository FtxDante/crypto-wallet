import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  public async generateDefaultCoin(owner: string) {
    const { code, fullname } = await this.apiService.getCoinInfo('BRL', 'USD');
    const coin = this.coinsRepository.create({
      coin: code,
      fullname,
      ownerId: owner,
    });
    await this.coinsRepository.save(coin);
    return coin;
  }

  public async createCoin(coinName, ownerId) {
    const { code, fullname } = await this.apiService.getCoinInfo(coinName);
    const coin = this.coinsRepository.create({
      coin: code,
      fullname,
      ownerId,
    });
    return await this.coinsRepository.save(coin);
  }

  public async findAllCoins(searchParams) {
    return await this.coinsRepository.find(searchParams);
  }

  public async updateValues(
    ownerId: string,
    { quoteTo, currentCoin, value }: WalletFunds,
  ) {
    const { cotation } = await this.apiService.getCoinInfo(
      currentCoin,
      quoteTo,
    );
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

    if (value < 0) {
      const withdraw = (value * -1) / cotation;
      if (coinCurrent.amont < withdraw) {
        throw new BadRequestException('No money enough');
      }
      coinCurrent.amont -= withdraw;
    } else {
      const cotationValueDeposit = value * cotation;
      coinQuote.amont += cotationValueDeposit;
    }
    await this.coinsRepository.save(coinCurrent);
    await this.coinsRepository.save(coinQuote);
    return await this.transactionsServices.createTransaction({
      value,
      dateTime: new Date(),
      coinId: coinCurrent.id,
      sendTo: ownerId,
      receiveFrom: ownerId,
      currentCotation: cotation,
    });
  }
}
