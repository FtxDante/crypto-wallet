import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../schemas/wallet.entity';
import { CreateCoinDto } from '../utils/dtos/coins/createcoin.dto';
import { CreateWalletDto } from '../utils/dtos/wallet/createwallet.dto';
import { UpdateWalletDto } from '../utils/dtos/wallet/updatewallet.dto';
import { CoinsService } from './coins.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly coinsService: CoinsService,
  ) {}

  async create(payload: CreateWalletDto) {
    const wallet = this.walletRepository.create(payload);
    wallet.coins = [await this.coinsService.generateDefaultCoin()];
    await this.walletRepository.save(wallet);
    return wallet;
  }

  async findAll(serachParams: UpdateWalletDto) {
    return await this.walletRepository.find({
      where: serachParams,
      relations: ['coins'],
    });
  }
}
