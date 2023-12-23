import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// this collection has a TTL on database level on the time property for 5 min

@Schema()
export class TempGps extends Document {
  @Prop({
    type: Date,
  })
  time: Date;

  @Prop({
    type: Array,
    minlength: 4,
    maxlength: 4,
  })
  data: number[];
}

export const TempGpsSchema = SchemaFactory.createForClass(TempGps);
