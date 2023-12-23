import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: false,
  _id: false,
})
export class Metric {
  @Prop({ type: Number })
  cpuPercent: number;

  @Prop({ type: Number })
  cpuTemperature: number;

  @Prop({ type: Number })
  diskPercentUsed: number;

  @Prop({ type: Date })
  lastBoot: Date;

  @Prop({ type: Number })
  memPercentUsed: number;

  @Prop({ type: Number })
  netBytesRecv: number;

  @Prop({ type: Number })
  netBytesSent: number;
}

export const MetricSchema = SchemaFactory.createForClass(Metric);
