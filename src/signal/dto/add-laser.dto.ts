import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class AddLaserDto {
  @IsNumber()
  @Type(() => Number)
  minHeight: number;

  @IsNumber()
  @Type(() => Number)
  maxHeight: number;

  @IsNumber()
  @Type(() => Number)
  maxZigzag: number;
}
