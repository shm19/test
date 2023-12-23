import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateSettingDto {
  @MinLength(3)
  @MaxLength(50)
  @IsString()
  @IsOptional()
  key: string;

  @IsNumber()
  @IsOptional()
  value: number;

  @MaxLength(50)
  @IsOptional()
  @IsString()
  description: string;
}
