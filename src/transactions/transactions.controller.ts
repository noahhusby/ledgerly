import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User } from '../auth/user.decorator';
import type { JwtPayload } from '../auth/auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@User() user: JwtPayload, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(user.sub, dto);
  }

  @Get()
  findAll(@User() user: JwtPayload) {
    return this.transactionsService.findAll(user.sub);
  }

  @Get('balance-history')
  getBalanceHistory(@User() user: JwtPayload) {
    return this.transactionsService.getBalanceHistory(user.sub);
  }

  @Get('balance-stats')
  getBalanceStats(@User() user: JwtPayload) {
    return this.transactionsService.getBalanceStats(user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }

  @Get('accounts-with-balances')
  findAccountsWithBalances(@User() user: JwtPayload) {
    return this.transactionsService.findAccountsWithBalances(user.sub);
  }
}
