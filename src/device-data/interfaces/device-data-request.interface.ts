import { Request } from 'express';

export interface DeviceDataRequest extends Request {
  connectTime: Date;
  dataType: string;
}
