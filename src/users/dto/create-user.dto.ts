import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { Public } from '../../auth/public.decorator';

@Public()
export class CreateUserDto {
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MaxLength(100)
  lastName: string;
}
