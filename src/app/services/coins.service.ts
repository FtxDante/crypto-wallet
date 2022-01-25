import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coins } from '../schemas/coins.entity';
import { CreateCoinDto } from '../utils/dtos/coins/createcoin.dto';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(Coins)
    private coinsRepository: Repository<Coins>,
  ) {}

  async generateDefaultCoin() {
    const coin = this.coinsRepository.create({
      coin: 'BRL',
      amont: 0,
      fullname: 'Real',
    });
    await this.coinsRepository.save(coin);
    return coin;
  }
}
