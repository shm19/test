import { IsDate, IsArray, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { IsTimeFormatValid } from '../validators/is-time-format-valid.validator';

export class ElectricityDto {
  @IsMongoId()
  deviceId: mongoose.Types.ObjectId;

  @IsDate()
  @Type(() => Date)
  @IsTimeFormatValid()
  time: Date;

  // "data": [10, 2, 5, 79],
  @IsArray()
  data: [number, number, number, number];
}
