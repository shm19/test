import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: false,
  _id: false,
})
export class Laser {
  @Prop({ type: Number })
  maxHeight: number;

  @Prop({ type: Number })
  minHeight: number;

  @Prop({ type: Number })
  maxZigzag: number;
}

export const LaserSchema = SchemaFactory.createForClass(Laser);
