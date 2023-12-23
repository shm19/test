import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Companies {
  @Prop({})
  companyId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  role: string;

  @Prop({})
  access: [string];

  @Prop({ required: true })
  position: string;
}
