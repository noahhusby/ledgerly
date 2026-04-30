import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AccountType } from '../../models';

export class CreateAccountDto {
  @IsString()
  @MaxLength(100)
  accountName: string;

  @IsEnum(AccountType)
  accountType: AccountType;

  @IsNumber()
  openingBalance: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currencyCode?: string;
}
