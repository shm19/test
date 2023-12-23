import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: false,
  _id: false,
})
export class TotalData {
  @Prop({ type: Number })
  acceleration: number;

  @Prop({ type: Number })
  gps: number;

  @Prop({ type: Number })
  electricity: number;

  @Prop({ type: Number })
  temperature: number;

  @Prop({ type: Number })
  systemMetric: number;

  @Prop({ type: Number })
  laser: number;

  @Prop({ type: Number })
  criticalErrors: number;
}

export const TotalDataSchema = SchemaFactory.createForClass(TotalData);
