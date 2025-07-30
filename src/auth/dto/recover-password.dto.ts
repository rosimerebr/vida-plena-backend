import { IsEmail, IsString, MinLength } from 'class-validator';

export class RecoverPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  secretAnswer: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
} 