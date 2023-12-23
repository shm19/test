import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Setting extends Document {
  @Prop({ type: String, required: true, unique: true })
  key: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: Number, required: true })
  value: number;

  @Prop({ type: Date })
  startTime?: Date;

  @Prop({ type: Date })
  endTime?: Date;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
