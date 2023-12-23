import { IsOptional, IsArray } from 'class-validator';

export class RangeDto {
  @IsOptional()
  @IsArray()
  acc: number[];

  @IsOptional()
  @IsArray()
  height: number[];

  @IsOptional()
  @IsArray()
  zigzag: number[];

  @IsOptional()
  @IsArray()
  cableRemain: number[];

  @IsOptional()
  @IsArray()
  force: number[];

  @IsOptional()
  @IsArray()
  cross_distance: number[];

  @IsOptional()
  @IsArray()
  arc: number[];

  @IsOptional()
  @IsArray()
  f2: number[];
}
