import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

enum StatusType {
  CREATED = 'created',
  GO_CHECK = 'go_check',
  IGNORE = 'ignore',
  FALSE_ALARM = 'false_alarm',
  NEED_REPAIR = 'need_repair',
  NONEED_REPAIR = 'noneed_repair',
  REPAIRED = 'repaired',
  MERGED = 'merged',
}

enum SpecialName {
  JOINT = 'joint',
  OVERLAP = 'overlap',
  CANTILEVER = 'cantilever',
  OTHER = 'other',
}

enum FaultName {
  HEIGHT = 'height',
  CONTACT_WIRE = 'contact_wire',
  ZIGZAG_OVERRUN = 'zigzag_overrun',
  WEARING = 'wearing',
  OVERHEAD_LINES_DROP = 'overhead_lines_drop',
  DROPPER_RUPTURE = 'dropper_rupture',
  DROPPER_DROP = 'dropper_drop',
  CORROSION = 'corrosion',
}

@Schema()
export class PointStatus extends Document {
  @Prop({ type: String, enum: StatusType, default: StatusType.CREATED })
  type: StatusType;

  @Prop({ default: Date.now })
  time: Date;

  @Prop({ type: Date })
  needToCheck: Date;

  @Prop({ default: false })
  visualChecked: boolean;

  @Prop({
    type: {
      name: { type: String, enum: SpecialName },
      description: { type: String },
    },
  })
  special: { name: SpecialName; description: string };

  @Prop({
    type: {
      name: { type: String, enum: FaultName },
      description: String,
    },
  })
  fault: { name: FaultName; description: string };

  @Prop({
    type: {
      isRepaired: { type: Boolean, default: false },
      description: String,
    },
  })
  repaired: { isRepaired: boolean; description: string };

  @Prop()
  image: string;
}

export const PointStatusSchema = SchemaFactory.createForClass(PointStatus);
