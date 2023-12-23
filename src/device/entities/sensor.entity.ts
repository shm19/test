import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: false,
  _id: false,
})
export class Sensor {
  @Prop({ type: Boolean })
  enabled: boolean;

  @Prop({ type: String })
  direction: string;
}

export const SensorSchema = SchemaFactory.createForClass(Sensor);
