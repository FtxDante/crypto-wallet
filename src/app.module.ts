import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Coins } from './schemas/coins.entity';
import { Transactions } from './schemas/transactions.entity';
import { Wallet } from './schemas/wallet.entity';
import { WalletModule } from './wallet/wallet.module';

const defaultOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...defaultOptions,
      name: 'default',
      database: 'walletdb',
      entities: [Coins, Wallet, Transactions],
      migrations: ['dist/db/migrations/*.migration.js'],
      cli: {
        entitiesDir: 'dist/schemas',
        migrationsDir: 'dist/db/migrations',
      },
    }),
    TypeOrmModule.forRoot({
      ...defaultOptions,
      name: 'test',
      database: 'jest',
      entities: [Coins, Wallet, Transactions],
      migrations: ['dist/db/migrations/*.migration.js'],
      cli: {
        entitiesDir: 'src/schemas',
        migrationsDir: 'src/db/migrations',
      },
    }),
    ,
    WalletModule,
  ],
})
export class AppModule {}
