import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountService } from '../account/account.service';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType } from '../models';

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

  async findAll(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        user: { userId },
      },

      relations: {
        account: true,
        toAccount: true,
      },

      order: {
        transactionDate: 'DESC',
        createdAt: 'DESC',
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }

  async getBalanceHistory(userId: string) {
    const days = 30;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(today);
    start.setDate(today.getDate() - (days - 1));

    const accounts = await this.accountService.findAllByUser(userId);

    const startingBalance = accounts.reduce(
      (sum, account) => sum + Number(account.openingBalance),
      0,
    );

    const transactions = await this.transactionRepository.find({
      where: {
        user: { userId },
      },
      relations: {
        account: true,
        toAccount: true,
      },
      order: {
        transactionDate: 'ASC',
      },
    });

    return Array.from({ length: days }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);

      const dateString = date.toISOString().slice(0, 10);

      const balanceChange = transactions
        .filter((tx) => tx.transactionDate <= dateString)
        .reduce((sum, tx) => {
          const amount = Number(tx.amount);

          switch (tx.transactionType) {
            case 'income':
              return sum + amount;

            case 'expense':
              return sum - amount;

            case 'transfer':
              return sum;

            default:
              return sum;
          }
        }, 0);

      return {
        date: dateString,
        balance: startingBalance + balanceChange,
      };
    });
  }

  async getBalanceStats(userId: string): Promise<{
    totalBalance: number;
    percentChangeFromLastMonth: number;
  }> {
    const accounts = await this.accountService.findAllByUser(userId);

    const openingBalanceTotal = accounts.reduce(
      (sum, account) => sum + Number(account.openingBalance),
      0,
    );

    const now = new Date();

    const previousMonthDate = new Date(now);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);

    const transactions = await this.findAll(userId);

    const currentTransactionTotal = transactions.reduce(
      (sum, transaction) => sum + this.getTransactionNetAmount(transaction),
      0,
    );

    const previousMonthTransactionTotal = transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.transactionDate);
        return transactionDate <= previousMonthDate;
      })
      .reduce(
        (sum, transaction) => sum + this.getTransactionNetAmount(transaction),
        0,
      );

    const totalBalance = openingBalanceTotal + currentTransactionTotal;
    const previousBalance = openingBalanceTotal + previousMonthTransactionTotal;

    const percentChangeFromLastMonth =
      previousBalance === 0
        ? 0
        : ((totalBalance - previousBalance) / Math.abs(previousBalance)) * 100;

    return {
      totalBalance,
      percentChangeFromLastMonth,
    };
  }

  private getTransactionNetAmount(transaction: Transaction): number {
    const amount = Number(transaction.amount);

    switch (transaction.transactionType) {
      case TransactionType.INCOME:
        return amount;

      case TransactionType.EXPENSE:
        return -amount;

      case TransactionType.TRANSFER:
        return 0;

      default:
        return 0;
    }
  }

  async findAccountsWithBalances(userId: string) {
    const accounts = await this.accountService.findAllByUser(userId);
    const transactions = await this.findAll(userId);

    return accounts.map((account) => {
      const transactionDelta = transactions.reduce((sum, transaction) => {
        return (
          sum +
          this.getTransactionNetAmountForAccount(transaction, account.accountId)
        );
      }, 0);

      return {
        ...account,
        currentBalance: Number(account.openingBalance) + transactionDelta,
      };
    });
  }

  private getTransactionNetAmountForAccount(
    transaction: Transaction,
    accountId: string,
  ): number {
    const amount = Number(transaction.amount);

    switch (transaction.transactionType) {
      case TransactionType.INCOME:
        return transaction.account.accountId === accountId ? amount : 0;

      case TransactionType.EXPENSE:
        return transaction.account.accountId === accountId ? -amount : 0;

      case TransactionType.TRANSFER:
        if (transaction.account.accountId === accountId) {
          return -amount;
        }

        if (transaction.toAccount?.accountId === accountId) {
          return amount;
        }

        return 0;

      default:
        return 0;
    }
  }
}
