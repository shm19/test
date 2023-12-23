/* eslint-disable no-use-before-define */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingDocument = Setting & Document;
@Schema()
export class Setting {
  @Prop({ required: true, trim: true, unique: true, min: 3 })
  key: string;

  @Prop({})
  description: string;

  @Prop({ required: true })
  value: number;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
