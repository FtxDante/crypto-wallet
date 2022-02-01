import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './app/controllers/wallet.controller';
import { Coins } from './app/schemas/coins.entity';
import { Transactions } from './app/schemas/transactions.entity';
import { Wallet } from './app/schemas/wallet.entity';
import { ApiCoinsService } from './app/services/api-axios.service';
import { CoinsService } from './app/services/coins.service';
import { TransactionsService } from './app/services/transactions.service';
import { WalletService } from './app/services/wallet.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Wallet, Coins, Transactions]),
    HttpModule,
  ],
  providers: [
    WalletService,
    CoinsService,
    TransactionsService,
    ApiCoinsService,
  ],
  controllers: [WalletController],
})
export class AppModule {}
