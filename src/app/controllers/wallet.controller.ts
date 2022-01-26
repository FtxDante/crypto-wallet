import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { WalletService } from '../services/wallet.service';
import { CreateWalletDto } from '../utils/dtos/wallet/createwallet.dto';
import { WalletFunds } from '../utils/interfaces/walletFounds';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}
  @UseInterceptors(ClassSerializerInterceptor)
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

  @Get('/:address')
  async getOneWallet(@Param('address') adress) {
    return await this.walletService.findOne(adress);
  }

  @Put('/:address')
  async updateFunds(@Param('address') address, @Body() payload: WalletFunds[]) {
    return await this.walletService.handlerOfFunds(address, payload);
  }
}
