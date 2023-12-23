import { IsString, IsNotEmpty } from 'class-validator';

export class PhoneDto {
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @IsString()
  @IsNotEmpty()
  realNumber: string;
}
