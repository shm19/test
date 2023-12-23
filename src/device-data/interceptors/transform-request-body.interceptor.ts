import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import mongoose from 'mongoose';
import { TransformedData } from '../interfaces/transformed-data.interface';

@Injectable()
export class TransformRequestBodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    const deviceId = Object.keys(req.body)[0];

    const { device: headerDeviceId } = req.headers;

    if (!deviceId || !mongoose.Types.ObjectId.isValid(deviceId)) {
      throw new BadRequestException(`Invalid deviceId ${headerDeviceId}`);
    }

    const { data, time } = req.body[deviceId];

    const transformedData: TransformedData = {
      deviceId: new mongoose.Types.ObjectId(deviceId),
      time: new Date(time),
      data,
    };

    req.body = transformedData;

    return next.handle();
  }
}
