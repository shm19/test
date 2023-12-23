import { Prop } from '@nestjs/mongoose';
import { Date } from 'mongoose';

export class History extends Document {
  @Prop({ required: true, enum: ['monitoring', 'simulation', 'sim_credit'] })
  type: string;

  @Prop({ required: true, enum: ['monitoring', 'simulation', 'sim_credit'] })
  status: string;

  @Prop({ required: true, enum: ['community', 'premium', 'enterprise'] })
  plan: string;

  @Prop({ required: true })
  start: Date;

  @Prop({ required: true })
  end: Date;

  @Prop({})
  credit: Date;
}
