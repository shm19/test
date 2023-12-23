import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Laser, LaserSchema } from './laser.entity';
import { Sensor, SensorSchema } from './sensor.entity';
import { Metric, MetricSchema } from './metrics.entity';
import { Installation, InstallationSchema } from './installation.entity';
import {
  SensorsEnablation,
  SensorsEnablationSchema,
} from './sensors-enablation.entity';
import { PowerSupply, PowerSupplySchema } from './power-supply.entity';
import { PositionOnTrain } from '../types/PositionOnTrain';
import { DeviceTypes } from '../types/DeviceTypes';

@Schema()
export class Device extends Document {
  @Prop({ type: String, required: true, enum: DeviceTypes })
  type: string;

  @Prop({ type: LaserSchema })
  laser: Laser;

  @Prop({ type: [SensorSchema] })
  accelerationSensors: Sensor[];

  @Prop({ type: Number, min: 1, max: 4 })
  defaultAccelerationSensor: number;

  @Prop({ type: MetricSchema })
  metric: Metric;

  @Prop({ type: InstallationSchema })
  installation: Installation;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  ip: string;

  @Prop({ type: Number })
  status: number;

  @Prop({ type: Date, default: Date.now })
  created_time: Date;

  @Prop({ type: String, default: 'pantograph_r', enum: PositionOnTrain })
  positionOnTrain: string;

  @Prop({ type: String })
  apiAddress: string;

  @Prop({ type: String, unique: true })
  hardwareId: string;

  @Prop({ type: SensorsEnablationSchema })
  sensorsEnablation: SensorsEnablation;

  @Prop({ type: PowerSupplySchema })
  powerSupply: PowerSupply;

  // @todo: add environement
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
