import { Body, Controller, Post } from '@nestjs/common';
import { WalletService } from '../services/wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}
  @Post()
  async createWallet(@Body() payload) {
    return 'a';
  }
}
