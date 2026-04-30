import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly userService: UsersService,
  ) {}

  async create(userId: string, dto: CreateAccountDto): Promise<Account> {
    const user = await this.userService.findById(userId);

    const account = this.accountRepository.create({
      user: user,
      accountName: dto.accountName,
      accountType: dto.accountType,
      openingBalance: dto.openingBalance,
      currentBalanceCached: dto.openingBalance,
      currencyCode: dto.currencyCode ?? 'USD',
      isActive: true,
    });

    return this.accountRepository.save(account);
  }

  async findAllByUser(userId: string): Promise<Account[]> {
    return this.accountRepository.find({
      where: {
        user: { userId },
        isActive: true,
      },

      order: {
        createdAt: 'DESC',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }

  async findOwnedById(userId: string, accountId: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: {
        accountId,
        user: { userId },
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }
}
