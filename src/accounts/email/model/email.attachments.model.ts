import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Attachment extends Document {
  @Prop({ default: ' ' })
  filename: string;

  @Prop({ default: ' ' })
  content: string;

  @Prop({ default: ' ' })
  contentType: string;
}
