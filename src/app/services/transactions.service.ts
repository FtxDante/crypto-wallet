import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions } from '../schemas/transactions.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
  ) {}

  async createTransaction({
    value,
    dateTime,
    coinId,
    sendTo,
    receiveFrom,
    currentCotation,
  }: any) {
    const created = this.transactionsRepository.create({
      value,
      dateTime,
      coinId,
      sendTo,
      receiveFrom,
      currentCotation,
    });

    return await this.transactionsRepository.save(created);
  }
}
