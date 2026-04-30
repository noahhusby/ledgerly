import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import type { JwtPayload } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@User() user: JwtPayload, @Body() dto: CreateAccountDto) {
    return this.accountService.create(user.sub, dto);
  }

  @Get()
  findAll(@User() user: JwtPayload) {
    return this.accountService.findAllByUser(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }
}
