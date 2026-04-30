export class StatValueDto {
  value: number;
  percentChange: number;
}

export class CategoryBreakdownDto {
  category: string;
  total: number;
  percentage: number;
}

export class TransactionStatsDto {
  totalTransactions: StatValueDto;
  totalIncome: StatValueDto;
  totalExpense: StatValueDto;
  categoryBreakdown: CategoryBreakdownDto[];
}
