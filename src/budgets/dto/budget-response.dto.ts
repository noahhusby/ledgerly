import {
  BudgetPeriodType,
  TransactionCategory,
} from '../../models';

export class BudgetResponseDto {
  budgetId: string;
  budgetName: string;
  periodType: BudgetPeriodType;
  category: TransactionCategory;
  budgetLimit: number;
  appliedAmount: number;
  remainingAmount: number;
  percentUsed: number;
  accountId?: string;
  accountName?: string;
  createdAt: Date;
  updatedAt: Date;
}
