import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { PhoneDto } from './phone.dto';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  companyId: string;

  @IsArray()
  @IsNotEmpty()
  access: [string];

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  lastName: string;

  @IsNotEmpty()
  @ValidateNested()
  phoneNumber: PhoneDto;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}
