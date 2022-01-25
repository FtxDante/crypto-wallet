import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../schemas/wallet.entity';
import { CreateWalletDto } from '../utils/dtos/wallet/createwallet.dto';
import { WalletPayload } from '../utils/interfaces/walletPayload';
import { CoinsService } from './coins.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly coinsService: CoinsService,
  ) {}

  async create(payload: CreateWalletDto) {
    try {
      const wallet = this.walletRepository.create(payload);
      await this.walletRepository.save(wallet);
      await this.coinsService.generateDefaultCoin(wallet.address);
      return wallet;
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll(searchParams: WalletPayload) {
    return await this.walletRepository.find({
      relations: ['coins'],
      where: searchParams,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(address) {
    const result = await this.walletRepository.findOne({
      where: { address },
    });
    if (!result) {
      throw new NotFoundException(`Address: ${address}`);
    }
    return result;
  }
}
