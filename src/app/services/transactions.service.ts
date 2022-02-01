import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions } from '../schemas/transactions.entity';
import { transaction } from '../utils/interfaces/transaction';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
  ) {}

  async createTransaction(payload: transaction) {
    const created = this.transactionsRepository.create({
      value: payload.value,
      dateTime: new Date(),
      coinId: payload.coinId,
      sendTo: payload.sendTo,
      receiveFrom: payload.receiveFrom,
      currentCotation: payload.currentCotation,
    });

    return await this.transactionsRepository.save(created);
  }
}
