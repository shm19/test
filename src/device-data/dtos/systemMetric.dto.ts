import {
  IsString,
  IsDate,
  IsNumber,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { IsTimeFormatValid } from '../validators/is-time-format-valid.validator';

class DataDto {
  @IsNumber()
  cpuTemperature: number;

  @IsNumber()
  cpuPercent: number;

  @IsNumber()
  diskPercentUsed: number;

  @IsNumber()
  memPercentUsed: number;

  @IsNumber()
  netBytesSent: number;

  @IsNumber()
  netBytesRecv: number;

  @IsNumber()
  lastBoot: number;
}

export class SystemMetricDto {
  @IsString()
  deviceId: mongoose.Types.ObjectId;

  @IsDate()
  @Type(() => Date)
  @IsTimeFormatValid()
  time: Date;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DataDto)
  data: DataDto;
}
