import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinsController } from './app/controllers/coins.controller';
import { TransactionsController } from './app/controllers/transactions.controller';
import { WalletController } from './app/controllers/wallet.controller';
import { Coins } from './app/schemas/coins.entity';
import { Transactions } from './app/schemas/transactions.entity';
import { Wallet } from './app/schemas/wallet.entity';
import { CoinsService } from './app/services/coins.service';
import { TransactionsService } from './app/services/transactions.service';
import { WalletService } from './app/services/wallet.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Wallet, Coins, Transactions]),
  ],
  providers: [WalletService, CoinsService, TransactionsService],
  controllers: [WalletController, CoinsController, TransactionsController],
})
export class AppModule {}
