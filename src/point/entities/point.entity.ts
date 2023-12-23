import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Point extends Document {
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
    },
  })
  gps: { type: string; coordinates: number[] };

  @Prop({ type: String, required: false })
  possibility: number;

  @Prop({ type: String, required: false })
  confidence: number;

  @Prop({ type: Date })
  time: Date;

  @Prop({ type: Number })
  counter: number;

  @Prop({ type: String, required: false })
  name: string;

  @Prop({ type: Number })
  degree: number;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Event' }],
    required: [true, 'point should have events'],
  })
  events: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'PointStatus' }],
  })
  statusHistory: Types.ObjectId[];
}

export const PointSchema = SchemaFactory.createForClass(Point);
