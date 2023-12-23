import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: false,
  _id: false,
})
export class PhoneNumber extends Document {
  @Prop({ type: String, default: ' ' })
  countryCode: string;

  @Prop({ type: String, default: ' ' })
  realNumber: string;
}

export const PhoneNumberSchema = SchemaFactory.createForClass(PhoneNumber);
