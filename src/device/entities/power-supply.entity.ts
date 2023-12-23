import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: false,
  _id: false,
})
export class PowerSupply {
  @Prop({ type: Boolean, default: false })
  ultrasonic: boolean;

  @Prop({ type: Boolean, default: false })
  solarPanel: boolean;

  @Prop({ type: Boolean, default: false })
  windTurbine: boolean;

  @Prop({ type: Boolean, default: false })
  currentTransformer: boolean;
}

export const PowerSupplySchema = SchemaFactory.createForClass(PowerSupply);
