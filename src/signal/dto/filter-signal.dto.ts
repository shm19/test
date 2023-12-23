import { IsISO8601, IsMongoId } from 'class-validator';
import mongoose from 'mongoose';

export class FilterDto {
  @IsMongoId()
  deviceId: mongoose.Types.ObjectId;

  @IsISO8601()
  time: Date;
}
