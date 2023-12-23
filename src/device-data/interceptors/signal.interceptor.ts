import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { SignalService } from 'src/signal/signal.service';

@Injectable()
export class SignalInterceptor implements NestInterceptor {
  constructor(private readonly signalService: SignalService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const { body } = context.switchToHttp().getRequest();
    const { time, deviceId } = body;
    await this.signalService.createSignalTemplate({ time, deviceId });

    return next.handle();
  }
}
