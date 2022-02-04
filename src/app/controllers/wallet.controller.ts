import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseArrayPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
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
  async getOneWallet(@Param('address', ParseUUIDPipe) address: string) {
    return await this.walletService.findWalletOrFail(address);
  }

  @Put('/:address')
  async updateFunds(
    @Param('address', ParseUUIDPipe) address: string,
    @Body(new ParseArrayPipe({ items: WalletFunds })) payload: WalletFunds[],
  ) {
    return await this.walletService.depositOrWithdrawal(address, payload);
  }

  @Post('/:address/transaction')
  async transferToWallet(
    @Param('address', ParseUUIDPipe) address: string,
    @Body() payload: CreateTransactionDto,
  ) {
    await this.walletService.findWalletOrFail(address);
    await this.walletService.findWalletOrFail(payload.receiverAddress);
    return this.walletService.transferFunds(address, payload);
  }

  @Get('/:address/transaction')
  async findCoinsFromWallet(@Param('address', ParseUUIDPipe) address: string) {
    return this.walletService.findCoins(address);
  }

  @Delete('/:address')
  @HttpCode(204)
  async deleteWallet(@Param('address', ParseUUIDPipe) address: string) {
    return this.walletService.deleteWallet(address);
  }
}
