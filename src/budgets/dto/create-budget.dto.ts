import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { BudgetPeriodType, TransactionCategory } from '../../models';

export class CreateBudgetDto {
  @IsString()
  @MaxLength(100)
  budgetName: string;

  @IsOptional()
  @IsUUID()
  accountId?: string;

  @IsEnum(BudgetPeriodType)
  periodType: BudgetPeriodType;

  @IsEnum(TransactionCategory)
  category: TransactionCategory;

  @IsNumber()
  budgetLimit: number;
}
