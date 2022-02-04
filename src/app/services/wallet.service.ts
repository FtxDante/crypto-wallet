import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
    private transactionService: TransactionsService,
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

  async findWalletOrFail(address: string) {
    const result = await this.walletRepository.findOne({
      where: { address },
    });
    if (!result) {
      throw new NotFoundException(`Address: ${address}`);
    }
    return result;
  }

  async depositOrWithdrawal(address: string, payloads: WalletFunds[]) {
    await this.findWalletOrFail(address);
    return Promise.all(
      payloads.map(async (payload) => {
        return await this.coinsService.updateFunds(address, payload);
      }),
    );
  }

  async transferFunds(fromAddress: string, payload: CreateTransactionDto) {
    const { cotation } = await this.apiService.getCoinInfo(
      payload.currentCoin,
      payload.quoteTo,
    );

    const coinToSend = await this.coinsService.findACoin({
      coin: payload.currentCoin,
      ownerId: fromAddress,
    });

    if (!coinToSend) {
      throw new NotFoundException(`Coin: ${payload.currentCoin}`);
    }

    if (payload.value < 0) {
      throw new BadRequestException('Value must to be greater than 0');
    }

    const cointToReceive = await this.coinsService.createACoinIfNotExists(
      payload.currentCoin,
      payload.quoteTo,
      payload.receiverAddress,
    );

    const withdrawal = payload.value * cotation;

    if (coinToSend.amont < withdrawal) {
      throw new BadRequestException('You not have money enough');
    }
    coinToSend.amont -= payload.value;
    cointToReceive.amont += payload.value * cotation;

    await this.coinsService.saveACoin(coinToSend);
    await this.coinsService.saveACoin(cointToReceive);
    return await this.transactionService.createTransaction(
      payload.value * cotation,
      coinToSend.id,
      payload.receiverAddress,
      fromAddress,
      cotation,
    );
  }

  async findCoins(where: any) {
    const wallet = await this.findWalletOrFail(where);
    const transformedData = wallet.coins.map((coin) => {
      return {
        coin: coin.coin,
        transactions: coin.transactions,
      };
    });
    return transformedData;
  }

  async deleteWallet(address: string) {
    const { coins } = await this.findWalletOrFail(address);
    for (const coin of coins) {
      if (coin.amont > 0)
        throw new UnauthorizedException('wallet still have funds');
    }
    this.walletRepository.softDelete(address);
  }
}
