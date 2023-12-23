import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { IsTimeFormatValid } from '../validators/is-time-format-valid.validator';

export class AccelerationDto {
  deviceId: mongoose.Types.ObjectId;

  @IsDate()
  @Type(() => Date)
  @IsTimeFormatValid()
  time: Date;

  data: [number, number, number[][]][];
}
