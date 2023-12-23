import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: false,
  _id: false,
})
export class SensorsEnablation {
  @Prop({ type: Boolean, default: true })
  gps: boolean;

  @Prop({ type: Boolean, default: false })
  tempreture: boolean;

  @Prop({ type: Boolean, default: false })
  acceleration: boolean;

  @Prop({ type: Boolean, default: false })
  camera: boolean;

  @Prop({ type: Boolean, default: false })
  laser: boolean;

  @Prop({ type: Boolean, default: false })
  battery: boolean;
}

export const SensorsEnablationSchema =
  SchemaFactory.createForClass(SensorsEnablation);
