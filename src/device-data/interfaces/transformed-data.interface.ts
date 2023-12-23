import mongoose from 'mongoose';

export interface TransformedData {
  deviceId: mongoose.Types.ObjectId;
  time: Date;
  data: any;
}
