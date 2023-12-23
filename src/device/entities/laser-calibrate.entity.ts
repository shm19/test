import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: false,
  _id: false,
})
export class LaserCalibrate {
  @Prop({ type: Number })
  height: number;

  @Prop({ type: Number })
  zigzag: number;
}

export const LaserCalibrateSchema =
  SchemaFactory.createForClass(LaserCalibrate);
