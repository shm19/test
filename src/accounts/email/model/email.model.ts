import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Attachment } from './email.attachments.model';

@Schema()
export class Email {
  @Prop({ required: true, trim: true })
  to: string;

  @Prop({ default: Date.now })
  time: Date;

  @Prop({})
  text: string;

  @Prop({})
  subject: string;

  @Prop({ default: null })
  attachments: [Attachment];

  @Prop({})
  status: number;
}
export type EmailDocument = Email & Document;
export const EmailSchema = SchemaFactory.createForClass(Email);
