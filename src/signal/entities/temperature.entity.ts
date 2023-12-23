import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: false,
  _id: false,
})
export class Temperature {
  @Prop({ type: Number })
  tempin: number;

  @Prop({ type: Number })
  tempout: number;
}

export const TemperatureSchema = SchemaFactory.createForClass(Temperature);
