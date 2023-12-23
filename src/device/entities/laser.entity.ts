import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  LaserThresholds,
  LaserThresholdsSchema,
} from './laser-thresholds.entity';
import { LaserCalibrate, LaserCalibrateSchema } from './laser-calibrate.entity';

@Schema({
  timestamps: false,
  _id: false,
})
export class Laser {
  @Prop({ type: LaserThresholdsSchema })
  thresholds: LaserThresholds;

  @Prop({ type: LaserCalibrateSchema })
  calibrate: LaserCalibrate;

  @Prop({ type: Number })
  diameter: number;
}

export const LaserSchema = SchemaFactory.createForClass(Laser);
