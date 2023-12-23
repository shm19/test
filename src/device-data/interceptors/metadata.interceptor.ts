import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { getClientIp } from 'request-ip';
import { DeviceDataRequest } from '../interfaces/device-data-request.interface';

@Injectable()
export class MetadataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: DeviceDataRequest = context.switchToHttp().getRequest();

    const dataType = req.originalUrl.split('/')[3];
    req.dataType = dataType;
    req.clientIp = getClientIp(req);

    return next.handle();
  }
}
