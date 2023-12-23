import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PhoneNumber } from 'libphonenumber-js';
import { Document } from 'mongoose';
import { PhoneNumberSchema } from 'src/accounts/models/phone-number.model';

@Schema()
export class Company {
  @Prop({ type: Number, required: true, default: 1 })
  status: number;

  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, trim: true })
  website: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    default: 'en',
    enum: ['en', 'de'],
    unique: true,
    lowercase: true,
  })
  language: string;

  @Prop({
    type: PhoneNumberSchema,
  })
  phoneNumber: PhoneNumber;

  @Prop({ type: String, required: true })
  mapAccess: string;

  @Prop({ type: [String], required: true })
  panelAccess: Array<string>;
}

export type CompanyDocument = Company & Document;

export const CompanySchema = SchemaFactory.createForClass(Company);
