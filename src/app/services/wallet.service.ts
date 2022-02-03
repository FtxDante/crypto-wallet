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
    private apiService: ApiCoinsService,
  ) {}

  async create(payload: CreateWalletDto) {
    try {
      const wallet = this.walletRepository.create(payload);
      await this.walletRepository.save(wallet);
      return wallet;
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll(searchParams: WalletPayload) {
    return await this.walletRepository.find({
      where: searchParams,
      order: { createdAt: 'ASC' },
    });
  }

  async findOneOrFail(address: string) {
    const result = await this.walletRepository.findOne({
      where: { address },
    });
    if (!result) {
      throw new NotFoundException(`Address: ${address}`);
    }
    return result;
  }

  async depositOrWithDrawal(address: string, payloads: WalletFunds[]) {
    await this.findOneOrFail(address);
    return Promise.all(
      payloads.map(async (payload) => {
        return await this.coinsService.addOrRemoveFunds(address, payload);
      }),
    );
  }

  async transfer(fromAddress: string, payload: CreateTransactionDto) {
    const { cotation } = await this.apiService.getCoinInfo(
      payload.currentCoin,
      payload.quoteTo,
    );

    const coinToSend = await this.coinsService.findACoin({
      coin: payload.currentCoin,
      ownerId: fromAddress,
    });

    const cointToReceive = await this.coinsService.findACoin({
      coin: payload.quoteTo,
      ownerId: payload.receiverAddress,
    });

    const withdrawal = payload.value / cotation;

    if (coinToSend.amont < withdrawal) {
      throw new BadRequestException('You not have money enough');
    }
    console.log(withdrawal);
    coinToSend.amont -= payload.value;
    cointToReceive.amont += payload.value * cotation;

    await this.coinsService.saveACoin(coinToSend);
    return await this.coinsService.saveACoin(cointToReceive);
  }
}
