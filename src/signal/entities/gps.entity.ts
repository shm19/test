import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: false,
  _id: false,
})
export class GPS {
  @Prop({ type: Number })
  time: number;

  @Prop({ type: String, default: 'Point', enum: ['Point'] })
  type: string;

  @Prop([Number])
  coordinates: number[];

  @Prop({ type: Number })
  speed: number;
}

export const GPSSchema = SchemaFactory.createForClass(GPS);
