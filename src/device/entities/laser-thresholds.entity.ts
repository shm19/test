import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: false,
  _id: false,
})
export class LaserThresholds {
  @Prop({ type: Number })
  heightMax: number;

  @Prop({ type: Number })
  heightMin: number;

  @Prop({ type: Number })
  zigzagMax: number;

  @Prop({ type: Number })
  zigzagMin: number;

  @Prop({ type: Number })
  cableRemain: number;
}

export const LaserThresholdsSchema =
  SchemaFactory.createForClass(LaserThresholds);
