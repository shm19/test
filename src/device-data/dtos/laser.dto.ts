import { IsDate, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { IsTimeFormatValid } from '../validators/is-time-format-valid.validator';

// @todo: add more validation to data
export class LaserDto {
  @IsMongoId()
  deviceId: mongoose.Types.ObjectId;

  @IsDate()
  @Type(() => Date)
  @IsTimeFormatValid()
  time: Date;

  data: [
    number,
    [number, number],
    [number, number],
    [number, number],
    [number, number],
  ][];
}
