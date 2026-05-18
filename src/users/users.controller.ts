import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import type { JwtPayload } from '../auth/auth.guard';
import { CurrentUserDto } from './dto/current-user.dto';
import { User } from '../auth/user.decorator';
import { Public } from '../auth/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return await this.usersService.create(dto);
  }

  @Get()
  async find(@User() jwt: JwtPayload) {
    return await this.usersService.findById(jwt.sub);
  }
}
