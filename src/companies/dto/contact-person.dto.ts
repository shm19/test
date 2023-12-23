import { Type } from 'class-transformer';
import { IsEmail, IsString, ValidateNested } from 'class-validator';
import { PhoneDto } from '../../auth/dto/phone.dto';

export class ContactPersonDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @Type(() => PhoneDto)
  @ValidateNested()
  phoneNumber: PhoneDto;
}
