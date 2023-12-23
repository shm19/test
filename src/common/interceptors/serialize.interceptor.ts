import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map } from 'rxjs';

interface ClassConstructor {
  new (...args: any[]): Record<string, any>;
}

class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(_ctx: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data: any) =>
        plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        }),
      ),
    );
  }
}

export const serialize = (dto: ClassConstructor): SerializeInterceptor =>
  new SerializeInterceptor(dto);
