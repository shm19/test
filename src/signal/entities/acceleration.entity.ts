import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: false,
  _id: false,
})
export class Acceleration {
  @Prop({ type: Number })
  accDuration: number;

  @Prop([Number])
  accStatus: number[];

  @Prop({ type: Number })
  sensor: number;

  @Prop({ type: Number })
  std: number;

  @Prop({ type: Number })
  missData: number;
}

export const AccelerationSchema = SchemaFactory.createForClass(Acceleration);
