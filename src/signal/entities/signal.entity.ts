import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Electricity, ElectricitySchema } from './electricity.entity';
import { GPS, GPSSchema } from './gps.entity';
import { TotalData, TotalDataSchema } from './total-data.entity';
import { Acceleration, AccelerationSchema } from './acceleration.entity';
import { Temperature, TemperatureSchema } from './temperature.entity';
import { Laser, LaserSchema } from './laser.entity';

@Schema()
export class Signal extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Device', required: true })
  deviceId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  time: Date;

  @Prop({ type: AccelerationSchema })
  acceleration?: Acceleration;

  @Prop({ type: [GPSSchema] })
  gps?: GPS[];

  @Prop({ type: ElectricitySchema })
  electricity?: Electricity;

  @Prop({ type: LaserSchema })
  laser?: Laser;

  @Prop({ type: TemperatureSchema })
  temperature?: Temperature;

  @Prop({ type: Number })
  avgSpeed?: number;

  @Prop({ type: Number })
  degree?: number;

  @Prop({ type: String })
  video?: string;

  @Prop({ type: Date, default: Date.now })
  created_at?: Date;

  @Prop({ type: TotalDataSchema })
  totalData?: TotalData;
}

export const SignalSchema = SchemaFactory.createForClass(Signal);
