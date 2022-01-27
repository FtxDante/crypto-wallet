import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../schemas/wallet.entity';
import { CreateWalletDto } from '../utils/dtos/wallet/createwallet.dto';
import { WalletFunds } from '../utils/interfaces/walletFounds';
import { WalletPayload } from '../utils/interfaces/walletPayload';
import { ApiCoinsService } from './api-axios.service';
import { CoinsService } from './coins.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly coinsService: CoinsService,
    private readonly apiService: ApiCoinsService,
  ) {}

  public async create(payload: CreateWalletDto) {
    try {
      const wallet = this.walletRepository.create(payload);
      await this.walletRepository.save(wallet);
      await this.coinsService.generateDefaultCoin(wallet.address);
      return wallet;
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  public async findAll(searchParams: WalletPayload) {
    return await this.walletRepository.find({
      where: searchParams,
      order: { createdAt: 'DESC' },
    });
  }

  public async findOne(address) {
    try {
      const result = await this.walletRepository.findOne({
        where: { address },
      });
      if (!result) {
        throw new NotFoundException(`Address: ${address}`);
      }
      return result;
    } catch (err: any) {
      throw err;
    }
  }

  public async handlerOfFunds(address: string, payloads: WalletFunds[]) {
    try {
      await this.findOne(address);
      return Promise.all(
        payloads.map((payload) => {
          return this.coinsService.updateValues(address, payload);
        }),
      );
    } catch (error) {
      return error;
    }
  }
}
