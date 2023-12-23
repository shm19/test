import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EventTypes } from '../types/event-types';

@Schema()
export class Event extends Document {
  @Prop({
    type: String,
    enum: EventTypes,
    required: true,
  })
  type: string;

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
  gps?: Record<string, any>;

  @Prop()
  imported?: boolean;

  @Prop({ default: false })
  normal?: boolean;

  @Prop()
  videoAddress?: string;

  @Prop()
  value?: number;

  @Prop()
  min?: number;

  @Prop()
  max?: number;

  @Prop()
  kur?: number;

  @Prop()
  sentTime: Date;

  @Prop()
  passedTime: number;

  @Prop()
  speed?: number;

  @Prop()
  image?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Device',
    required: true,
  })
  deviceId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Signal',
    required: true,
  })
  signalId: Types.ObjectId;
}

export const EventSchema = SchemaFactory.createForClass(Event);
