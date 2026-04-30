// transactions/transaction.entity.ts
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
import { TransactionCategory } from '../../transaction-categories/entities/transaction-category.entity';
import { TransactionStatus, TransactionType } from '../../models';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transactionId: string;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Account, (account) => account.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => Account, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'to_account_id' })
  toAccount?: Account;

  @ManyToOne(() => TransactionCategory, (category) => category.transactions, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category: TransactionCategory;

  @Column({ type: 'simple-enum', enum: TransactionType })
  transactionType: TransactionType;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: string;

  @Column({ type: 'date' })
  transactionDate: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ length: 255, nullable: true })
  merchantName?: string;

  @Column({
    type: 'simple-enum',
    enum: TransactionStatus,
    default: TransactionStatus.POSTED,
  })
  status: TransactionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
