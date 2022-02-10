import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coins } from '../schemas/coins.entity';
import { FindACoin } from '../utils/interfaces/findACoin';
import { WalletFunds } from '../utils/interfaces/walletFounds';
import { externalDataService } from './external-data.service';
import { TransactionsService } from './transactions.service';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(Coins, 'j')
    private coinsRepository: Repository<Coins>,
    private apiService: externalDataService,
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

    const coinToReceive = await this.createACoinIfNotExists(
      payload.currentCoin,
      payload.quoteTo,
      ownerId,
    );

    if (payload.value < 0) {
      const withdrawal = (payload.value * -1) / cotation;
      if (coinToReceive.amont < withdrawal) {
        throw new BadRequestException('You not have money enough');
      }
      coinToReceive.amont -= withdrawal;
    } else {
      const cotationValueDeposit = payload.value * cotation;
      coinToReceive.amont += cotationValueDeposit;
    }

    await this.saveACoin(coinToReceive);
    return await this.transactionsServices.createTransaction(
      payload.value * cotation,
      coinToReceive.id,
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
    let found = await this.coinsRepository.findOne({
      where: { ownerId, coin: quoteTo },
    });

    if (!found) {
      found = await this.createCoin(currentCoin, quoteTo, ownerId);
    }
    return found;
  }

  async findACoin(where: FindACoin) {
    return this.coinsRepository.findOne(where);
  }

  async saveACoin(coin: Coins) {
    return this.coinsRepository.save(coin);
  }
}
