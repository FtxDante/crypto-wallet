import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { WalletService } from '../services/wallet.service';
import { CreateTransactionDto } from '../utils/dtos/transactions/createtransactions.dto';
import { CreateWalletDto } from '../utils/dtos/wallet/createwallet.dto';
import { WalletFunds } from '../utils/interfaces/walletFounds';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}
  @Post()
  async createWallet(@Body() payload: CreateWalletDto) {
    const created = this.walletService.create(payload);
    return created;
  }

  @Get()
  async getAll(@Query() queries: any) {
    const allWallets = this.walletService.findAll(queries);
    return allWallets;
  }

  @Get('/:address')
  async getOneWallet(@Param('address') address: string) {
    return await this.walletService.findOne(address);
  }

  @Put('/:address')
  async updateFunds(
    @Param('address') address: string,
    @Body() payload: WalletFunds[],
  ) {
    return await this.walletService.depositOrWithDrawal(address, payload);
  }

  @Post('/:address/transaction')
  async tranferToWallet(
    @Param('address') address: string,
    @Body() payload: CreateTransactionDto,
  ) {
    return this.walletService.transfer(address, payload);
  }
}
