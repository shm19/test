import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: false,
  _id: false,
})
export class Electricity {
  @Prop({ type: Number })
  current: number;

  @Prop({ type: Number })
  battery: number;

  @Prop({ type: Number })
  percentage: number;

  @Prop({ type: Number })
  voltage: number;
}

export const ElectricitySchema = SchemaFactory.createForClass(Electricity);
