import { Module, DynamicModule, Global } from '@nestjs/common';
import { MyLoggerService } from './myLogger.service';
import { ProdLogger } from './prodLogger';
import { DevLogger } from './devLogger';
import { Environment } from '../types/environment';

export const LOGGER_PROVIDER_TOKEN = 'LoggerProvider';

@Global()
@Module({})
export class LoggerModule {
  static forRoot(): DynamicModule {
    const environment = process.env.NODE_ENV as Environment;
    const loggerProvider =
      environment === Environment.Production ? ProdLogger : DevLogger;
    return {
      module: LoggerModule,
      providers: [
        {
          provide: LOGGER_PROVIDER_TOKEN,
          useClass: loggerProvider,
        },
        MyLoggerService,
      ],
      exports: [MyLoggerService],
    };
  }
}
