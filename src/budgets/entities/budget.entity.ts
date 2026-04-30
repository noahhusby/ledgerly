// budgets/budget.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TransactionCategory } from '../../transaction-categories/entities/transaction-category.entity';
import { Account } from '../../account/entities/account.entity';
import { BudgetPeriodType } from '../../models';

@Entity('budgets')
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  budgetId: string;

  @ManyToOne(() => User, (user) => user.budgets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => TransactionCategory, (category) => category.budgets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: TransactionCategory;

  @ManyToOne(() => Account, (account) => account.budgets, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  account?: Account;

  @Column({ type: 'simple-enum', enum: BudgetPeriodType })
  periodType: BudgetPeriodType;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date', nullable: true })
  endDate?: string;

  @Column('decimal', { precision: 12, scale: 2 })
  budgetLimit: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
