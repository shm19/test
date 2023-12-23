import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class AddSettingDto {
  @MinLength(3)
  @MaxLength(50)
  @IsString()
  key: string;

  @IsNumber()
  value: number;

  @MaxLength(50)
  @IsString()
  description: string;
}
