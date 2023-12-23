import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { MyLoggerService } from 'src/logger/myLogger.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class SaveDeviceDataInterceptor implements NestInterceptor {
  constructor(private readonly logger: MyLoggerService) {}

  async intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    return next.handle().pipe(
      tap(() => {
        const { body } = ctx.switchToHttp().getRequest();
        this.logger.log(`After... ${Date.now()}ms`);
      }),
    );
  }
}
