import { IsEmail, IsString, MinLength, IsNumber, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @Matches(/^\d{2}\/\d{2}\/\d{2}$/, {
    message: 'Date of birth must be in DD/MM/YY format'
  })
  dateOfBirth: string;

  @IsNumber()
  weight: number;
}
