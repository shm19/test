import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Thresholds extends Document {
  @Prop({})
  acc: [number];

  @Prop({})
  height: [number];

  @Prop({})
  zigzag: [number];

  @Prop({})
  cableRemain: [number];

  @Prop({})
  force: [number];

  @Prop({})
  cross_distance: [number];

  @Prop({})
  arc: [number];

  @Prop({})
  f2: [number];
}
