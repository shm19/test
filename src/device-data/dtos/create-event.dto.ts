import { IsNumber } from 'class-validator';

export class CreateEventDto {
  @IsNumber()
  hitTime: number;

  value: {
    value: number;
    kur?: number;
    min?: number;
    max?: number;
  };

  gps?: Record<string, any>;

  type: string;

  speed?: number;

  normal?: boolean;
}
