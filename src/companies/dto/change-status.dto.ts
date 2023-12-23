import { IsNotEmpty, IsNumber } from 'class-validator';

export class ChangeStatusDto {
  @IsNumber()
  @IsNotEmpty()
  status: number;
}
