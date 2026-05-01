import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { User } from '../auth/user.decorator';
import { Budget } from './entities/budget.entity';
import { BudgetResponseDto } from './dto/budget-response.dto';
import type { JwtPayload } from '../auth/auth.guard';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  create(
    @User() user: JwtPayload,
    @Body() dto: CreateBudgetDto,
  ): Promise<Budget> {
    return this.budgetsService.create(user.sub, dto);
  }

  @Get()
  findAll(@User() user: JwtPayload): Promise<BudgetResponseDto[]> {
    return this.budgetsService.findAll(user.sub);
  }

  @Delete(':budgetId')
  delete(
    @User() user: JwtPayload,

    @Param('budgetId') budgetId: string,
  ): Promise<void> {
    return this.budgetsService.deleteById(user.sub, budgetId);
  }
}
