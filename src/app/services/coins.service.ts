import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coins } from '../schemas/coins.entity';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(Coins)
    private coinsRepository: Repository<Coins>,
  ) {}

  async generateDefaultCoin(owner: string) {
    const coin = this.coinsRepository.create({
      coin: 'BRL',
      amont: 0,
      fullname: 'Real',
      ownerId: owner,
    });
    await this.coinsRepository.save(coin);
    return coin;
  }

  async findAllCoins(searchParams) {
    return await this.coinsRepository.find(searchParams);
  }
}
