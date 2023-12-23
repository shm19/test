import { IsDate, IsArray, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { IsTimeFormatValid } from '../validators/is-time-format-valid.validator';

export class GPSDto {
  @IsMongoId()
  deviceId: mongoose.Types.ObjectId;

  @IsDate()
  @Type(() => Date)
  @IsTimeFormatValid()
  time: Date;

  @IsArray()
  data: [number, number, number, number][];
}
