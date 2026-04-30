import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountService } from '../account/account.service';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly accountService: AccountService,
  ) {}

  async create(
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<Transaction> {
    const account = await this.accountService.findOwnedById(
      userId,
      dto.accountId,
    );

    const toAccount = dto.toAccountId
      ? await this.accountService.findOwnedById(userId, dto.toAccountId)
      : undefined;

    const transaction = this.transactionRepository.create({
      user: account.user,
      account,
      toAccount,
      category: dto.category,
      transactionType: dto.transactionType,
      amount: dto.amount,
      transactionDate: dto.transactionDate,
      description: dto.description,
      merchantName: dto.merchantName,
    });

    return this.transactionRepository.save(transaction);
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
