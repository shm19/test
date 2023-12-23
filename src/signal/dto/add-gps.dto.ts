import { IsNumber, Min, Max } from 'class-validator';
import { GPS } from '../entities/gps.entity';

export class addGpsDto {
  @IsNumber()
  gps: GPS[];

  @Min(0)
  @IsNumber()
  avgSpeed: number;

  @Max(360)
  @Min(0)
  @IsNumber()
  degree: number;
}
