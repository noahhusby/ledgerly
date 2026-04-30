import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { TransactionCategory, TransactionType } from '../../models';

export class CreateTransactionDto {
  @IsUUID()
  accountId: string;

  @IsOptional()
  @IsUUID()
  toAccountId?: string;

  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsDateString()
  transactionDate: string;

  @IsEnum(TransactionCategory)
  category: TransactionCategory;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  merchantName?: string;
}
