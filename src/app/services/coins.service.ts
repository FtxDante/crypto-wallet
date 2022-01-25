import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coins } from '../schemas/coins.entity';

@Injectable()
export class CoinsService {
  private coin;
  private amont;
  private fullname;

  constructor(
    @InjectRepository(Coins)
    private coinsRepository: Repository<Coins>,
  ) {
    this.coin = 'BRL';
    this.amont = 0;
    this.fullname = 'Real';
  }

  async generateDefaultCoin() {
    const coin = this.coinsRepository.create({
      coin: this.coin,
      amont: this.amont,
      fullname: this.fullname,
    });
    await this.coinsRepository.save(coin);
    return coin;
  }
}
