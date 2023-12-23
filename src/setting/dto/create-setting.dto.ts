import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsEnum,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SettingKey } from '../types/setting-key.enum';

export class CreateSettingDto {
  @IsEnum(SettingKey, { message: 'key must be a valid setting key' })
  @Length(3, 50, { message: 'key must be between 3 and 50 characters' })
  key: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  @Length(0, 500, { message: 'description must be 500 characters or less' })
  description?: string;

  @IsNumber({}, { message: 'value must be a number' })
  value: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'startTime must be a Date' })
  startTime?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'endTime must be a Date' })
  endTime?: Date;
}
