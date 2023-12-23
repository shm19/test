import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class AddElectricityDto {
  @IsNumber()
  @Type(() => Number)
  voltage: number;

  @IsNumber()
  @Type(() => Number)
  current: number;

  @IsNumber()
  @Type(() => Number)
  battery: number;

  @IsNumber()
  @Type(() => Number)
  percentage: number;
}
