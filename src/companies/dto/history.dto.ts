import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class HistoryDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  @IsString()
  plan: string;

  @IsNotEmpty()
  @IsOptional()
  start: Date;

  @IsNotEmpty()
  @IsOptional()
  end: Date;
}
