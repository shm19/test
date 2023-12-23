import { Type } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsArray,
  IsOptional,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { ContactPersonDto } from './contact-person.dto';
import { PhoneDto } from '../../auth/dto/phone.dto';
import { HistoryDto } from './history.dto';

export class AddCompanyDto {
  @IsNumber()
  @IsNotEmpty()
  status: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  website: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  language: string;

  @Type(() => PhoneDto)
  @IsOptional()
  @ValidateNested()
  phoneNumber: PhoneDto;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  mapAccess: string;

  @IsArray()
  @IsNotEmpty()
  panelAccess: [string];

  @Type(() => ContactPersonDto)
  @IsOptional()
  @ValidateNested()
  contactPerson: ContactPersonDto;

  @Type(() => HistoryDto)
  @IsOptional()
  @IsArray()
  @ValidateNested()
  history: [HistoryDto];
}
