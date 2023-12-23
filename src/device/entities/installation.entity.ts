import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: false,
  _id: false,
})
export class Installation {
  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: String })
  picture: string;

  @Prop({ type: String })
  calibrationVideo: string;
}

export const InstallationSchema = SchemaFactory.createForClass(Installation);
