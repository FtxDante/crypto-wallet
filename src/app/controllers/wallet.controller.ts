import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WalletService } from '../services/wallet.service';
import { CreateWalletDto } from '../utils/dtos/wallet/createwallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}
  @Post()
  async createWallet(@Body() payload: CreateWalletDto) {
    const created = this.walletService.create(payload);
    return created;
  }

  @Get()
  async getAll(@Query() queries) {
    const allWallets = this.walletService.findAll(queries);
    return allWallets;
  }
}
