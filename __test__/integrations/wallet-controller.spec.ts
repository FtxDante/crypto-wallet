import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestJs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { clearDB } from '../helper/clean-database';
import { Coins } from '../../src/schemas/coins.entity';
import { Transactions } from '../../src/schemas/transactions.entity';
import { Wallet } from '../../src/schemas/wallet.entity';
import { CoinsService } from '../../src/wallet/coins.service';
import { externalDataService } from '../../src/wallet/external-data.service';
import { TransactionsService } from '../../src/wallet/transactions.service';
import { WalletController } from '../../src/wallet/wallet.controller';
import { WalletService } from '../../src/wallet/wallet.service';

describe('WalletController', () => {
  let controller: WalletController;
  let service: WalletService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
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
    }).compile();

    service = moduleRef.get<WalletService>(WalletService);
    controller = moduleRef.get<WalletController>(WalletController);
  });

  afterEach(async () => {
    await clearDB();
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a array of wallets', async () => {
    const walletCreated = await controller.createWallet({
      name: 'Dante Rodrigues',
      cpf: '910.990.339-20',
      birthday: <Date>(<unknown>'2011/05/01'),
    });
    const wallets: Wallet[] = await controller.getAll({});
    expect(wallets).toBeDefined();
    expect(wallets[0].address).toBe(walletCreated.address);
    expect(wallets[0].name).toBe('Dante Rodrigues');
    expect(wallets[0].cpf).toBe('910.990.339-20');
    expect(wallets[0].birthday).toMatch(/2011\-05\-01/);
  });
});
