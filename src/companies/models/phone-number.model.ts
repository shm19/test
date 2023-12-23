import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class PhoneNumber extends Document {
  @Prop({ default: ' ' })
  countryCode: string;

  @Prop({ default: ' ' })
  realNumber: string;
}
