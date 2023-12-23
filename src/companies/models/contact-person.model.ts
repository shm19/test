import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PhoneNumberSchema } from 'src/accounts/models/phone-number.model';
import { PhoneNumber } from './phone-number.model';

export class ContantPerson extends Document {
  @Prop({ type: String, default: ' ', trim: true })
  firstName: string;

  @Prop({ type: String, default: ' ', trim: true })
  lastName: string;

  @Prop({ lowercase: true, trim: true })
  email: string;

  @Prop({ type: PhoneNumberSchema })
  phoneNumber: PhoneNumber;
}
