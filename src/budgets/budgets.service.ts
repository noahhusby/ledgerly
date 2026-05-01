import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { AccountService } from '../account/account.service';
import { TransactionsService } from '../transactions/transactions.service';
import { Budget } from './entities/budget.entity';
import { BudgetResponseDto } from './dto/budget-response.dto';
import { BudgetPeriodType } from '../models';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
    private readonly usersService: UsersService,
    private readonly accountsService: AccountService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async create(userId: string, dto: CreateBudgetDto): Promise<Budget> {
    const user = await this.usersService.findById(userId);

    const account = dto.accountId
      ? await this.accountsService.findOwnedById(userId, dto.accountId)
      : null;

    const budget = this.budgetRepository.create({
      user: user,
      account: account,
      periodType: dto.periodType,
      category: dto.category,
      budgetLimit: dto.budgetLimit,
      budgetName: dto.budgetName,
    });

    return this.budgetRepository.save(budget);
  }

  async findAll(userId: string): Promise<BudgetResponseDto[]> {
    const budgets = await this.budgetRepository.find({
      where: {
        user: { userId },
      },

      relations: {
        account: true,
      },

      order: {
        createdAt: 'DESC',
      },
    });

    const transactions = await this.transactionsService.findAll(userId);

    return budgets.map((budget) => {
      const { start, end } = this.getCurrentPeriodRange(budget.periodType);

      const appliedAmount = transactions

        .filter((transaction) => {
          const transactionDate = new Date(transaction.transactionDate);

          const matchesDate =
            transactionDate >= start && transactionDate <= end;

          const matchesCategory = transaction.category === budget.category;

          const matchesAccount =
            !budget.account ||
            transaction.account.accountId === budget.account.accountId;

          return matchesDate && matchesCategory && matchesAccount;
        })

        .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

      const remainingAmount = budget.budgetLimit - appliedAmount;

      const percentUsed =
        budget.budgetLimit === 0
          ? 0
          : (appliedAmount / budget.budgetLimit) * 100;

      return {
        budgetId: budget.budgetId,
        budgetName: budget.budgetName,
        periodType: budget.periodType,
        category: budget.category,
        budgetLimit: budget.budgetLimit,
        appliedAmount,
        remainingAmount,
        percentUsed,
        accountId: budget.account?.accountId,
        accountName: budget.account?.accountName,
        createdAt: budget.createdAt,
        updatedAt: budget.updatedAt,
      };
    });
  }

  async deleteById(userId: string, budgetId: string): Promise<void> {
    const budget = await this.budgetRepository.findOne({
      where: {
        budgetId,

        user: { userId },
      },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    await this.budgetRepository.remove(budget);
  }

  private getCurrentPeriodRange(periodType: BudgetPeriodType): {
    start: Date;
    end: Date;
  } {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);
    switch (periodType) {
      case BudgetPeriodType.WEEKLY:
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;

      case BudgetPeriodType.MONTHLY:
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(start.getMonth() + 1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;

      case BudgetPeriodType.YEARLY:
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(11, 31);
        end.setHours(23, 59, 59, 999);
        break;
    }

    return { start, end };
  }
}
