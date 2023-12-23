import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { PhoneNumber } from './phone-number.model';
import { Company } from '../../companies/models/company.model';
import { Companies } from '../../companies/models/companies.model';

@Schema()
export class Account {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, trim: true })
  username: string;

  @Prop({
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  })
  email: string;

  @Prop({})
  phoneNumber: PhoneNumber;

  @Prop({
    required: true,
    trim: true,
    default: 'en',
    enum: ['en', 'de'],
    unique: true,
    lowercase: true,
  })
  language: string;

  @Prop({
    required: true,
    trim: true,
    default: 'dark',
    enum: ['dark', 'light'],
  })
  theme: string;

  @Prop({ minlength: 8, required: true, select: false })
  password: string;

  @Prop({})
  passwordResetToken: string;

  @Prop({})
  passwordResetExpiresAt: Date;

  @Prop({ default: null })
  lastOnline: Date;

  @Prop({ default: null, ref: Company.name })
  selectedCompany: mongoose.Types.ObjectId;

  @Prop({ default: null })
  companies: [Companies];

  @Prop({ default: null })
  knownIp: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
export type AccountDocument = Account & Document;
// eslint-disable-next-line func-names
AccountSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});
// eslint-disable-next-line func-names
AccountSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

AccountSchema.methods.comparePassword = async (inputPassword, userPassword) =>
  bcrypt.compare(inputPassword, userPassword);

// eslint-disable-next-line func-names
AccountSchema.methods.createPasswordRestToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpiresAt = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
