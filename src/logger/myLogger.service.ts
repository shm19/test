import { Logger } from 'winston';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { LoggerProvider } from './logger-provider.interface';
import { LOGGER_PROVIDER_TOKEN } from './logger.module';

@Injectable()
export class MyLoggerService implements LoggerService {
  private readonly logger: Logger;

  constructor(
    @Inject(LOGGER_PROVIDER_TOKEN)
    private readonly loggerProvider: LoggerProvider,
  ) {
    this.logger = this.loggerProvider.getLogger();
  }

  log(message: any, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: any, context?: string) {
    this.logger.warn(message, { context });
  }

  debug?(message: any, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose?(message: any, context?: string) {
    this.logger.verbose(message, { context });
  }
}
