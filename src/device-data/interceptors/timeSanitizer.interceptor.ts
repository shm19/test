import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TransformedData } from '../interfaces/transformed-data.interface';

@Injectable()
export class TimeSanitizerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { time }: TransformedData = req.body;

    if (!time) {
      throw new HttpException('Invalid time', HttpStatus.BAD_REQUEST);
    }

    time.setSeconds(0);
    time.setMilliseconds(0);

    return next.handle();
  }
}
