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
import { CoinsService } from './coins.service';
import { CreateTransactionDto } from '../utils/dtos/transactions/createtransactions.dto';
import { TransactionsService } from './transactions.service';
import { ApiCoinsService } from './api-axios.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private coinsService: CoinsService,
    private transactionsService: TransactionsService,
    private apiService: ApiCoinsService,
  ) {}

  public async create(payload: CreateWalletDto) {
    try {
      const wallet = this.walletRepository.create(payload);
      await this.walletRepository.save(wallet);
      return wallet;
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  public async findAll(searchParams: WalletPayload) {
    return await this.walletRepository.find({
      where: searchParams,
      order: { createdAt: 'ASC' },
    });
  }

  public async findOne(address: string) {
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

  public async depositOrWithDrawal(address: string, payloads: WalletFunds[]) {
    try {
      await this.findOne(address);
      return Promise.all(
        payloads.map(async (payload) => {
          return await this.coinsService.updateValues(address, payload);
        }),
      );
    } catch (error) {
      return error;
    }
  }

  public async transfer(fromAddress: string, payload: CreateTransactionDto) {
    const fromWallet = await this.findOne(fromAddress);
    const receiveWallet = await this.findOne(payload.receiverAddress);

    const coinToTranfers = await this.coinsService.findCoin({
      ownerId: fromWallet.address,
      coin: payload.currentCoin,
    });

    const coinToReceive = await this.coinsService.findCoin({
      ownerId: receiveWallet.address,
      coin: payload.quoteTo,
    });
  }
}
