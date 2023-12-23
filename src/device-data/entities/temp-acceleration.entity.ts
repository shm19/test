import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// this collection has a TTL on database level on the time property for 5 min

@Schema()
export class TempAcceleration extends Document {
  @Prop({
    type: Date,
    required: true,
  })
  time: Date;

  @Prop({ type: Types.ObjectId, ref: 'Device', required: true })
  deviceId: Types.ObjectId;

  @Prop({
    type: Array,
    required: true,
    minlength: 4,
    maxlength: 4,
  })
  data: [number, number, number[][]][];
}

export const TempAccelerationSchema =
  SchemaFactory.createForClass(TempAcceleration);
