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
import { Account } from '../../account/entities/account.entity';
import {
  BudgetPeriodType,
  TransactionCategory,
} from '../../models';

@Entity('budgets')
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  budgetId: string;

  @ManyToOne(() => User, (user) => user.budgets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 100 })
  budgetName: string;

  @ManyToOne(() => Account, (account) => account.budgets, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  account: Account | null;

  @Column({ type: 'simple-enum', enum: BudgetPeriodType })
  periodType: BudgetPeriodType;

  @Column({ type: 'simple-enum', enum: TransactionCategory })
  category: TransactionCategory;

  @Column({ type: 'real' })
  budgetLimit: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
