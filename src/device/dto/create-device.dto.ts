import {
  IsString,
  IsBoolean,
  IsNumber,
  IsEnum,
  IsISO8601,
  ValidateNested,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Installation } from '../entities/installation.entity';
import { Metric } from '../entities/metrics.entity';
import { Laser } from '../entities/laser.entity';
import { PositionOnTrain } from '../types/PositionOnTrain';

class AccelerationSensors {
  @IsBoolean()
  enabled: boolean;

  @IsString()
  direction: string;
}

class EnabledSensors {
  @IsBoolean()
  gps: boolean;

  @IsBoolean()
  tempreture: boolean;

  @IsBoolean()
  acceleration: boolean;

  @IsBoolean()
  camera: boolean;

  @IsBoolean()
  laser: boolean;

  @IsBoolean()
  battery: boolean;
}

class PowerSupply {
  @IsOptional()
  @IsBoolean()
  pcamTurbine: boolean;

  @IsOptional()
  @IsBoolean()
  battery: boolean;

  @IsOptional()
  @IsBoolean()
  solarPanel: boolean;

  @IsOptional()
  @IsBoolean()
  windTurbine: boolean;

  @IsOptional()
  @IsBoolean()
  computedTomography: boolean;

  @IsOptional()
  @IsBoolean()
  ultrasonic: boolean;
}

export class CreateDeviceDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  hardwareId: string;

  @IsString()
  apiAdress: string;

  @IsISO8601()
  createdTime: Date;

  @IsISO8601()
  lastConnect: Date;

  @ValidateNested()
  @Type(() => AccelerationSensors)
  accelerationSensors: AccelerationSensors;

  @Max(4)
  @Min(1)
  @IsNumber()
  defaultAccelerationSensor: number;

  @ValidateNested()
  @Type(() => EnabledSensors)
  enabledSensors: EnabledSensors;

  @IsEnum(PositionOnTrain)
  positionOnTrain: PositionOnTrain;

  @ValidateNested()
  @Type(() => PowerSupply)
  powerSupply: PowerSupply;

  @ValidateNested()
  @Type(() => Installation)
  installation: Installation;

  @Type(() => Metric)
  metric: Metric;

  @Type(() => Laser)
  laser: Laser;
}
