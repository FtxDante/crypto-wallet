import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coins } from 'src/schemas/coins.entity';
import { Transactions } from 'src/schemas/transactions.entity';
import { Wallet } from 'src/schemas/wallet.entity';
import { CoinsService } from './coins.service';
import { externalDataService } from './external-data.service';
import { TransactionsService } from './transactions.service';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, Coins, Transactions]),
    HttpModule,
  ],
  controllers: [WalletController],
  providers: [
    CoinsService,
    TransactionsService,
    WalletService,
    externalDataService,
  ],
})
export class WalletModule {}
