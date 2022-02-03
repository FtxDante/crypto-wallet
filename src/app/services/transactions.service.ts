import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Transactions } from '../schemas/transactions.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
    private connection: Connection,
  ) {}

  async createTransaction(
    value: number,
    coinId: string,
    sendTo: string,
    receiveFrom: string,
    currentCotation: number,
  ) {
    const created = this.transactionsRepository.create({
      value,
      dateTime: new Date(),
      coinId,
      sendTo,
      receiveFrom,
      currentCotation,
    });

    return await this.transactionsRepository.save(created);
  }
}
