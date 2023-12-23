/* eslint-disable class-methods-use-this */
import { createLogger, format, transports } from 'winston';
import { Injectable } from '@nestjs/common';
import { LoggerProvider } from './logger-provider.interface';

@Injectable()
export class ProdLogger implements LoggerProvider {
  getLogger() {
    const { combine, errors, timestamp, json, prettyPrint } = format;

    return createLogger({
      level: 'error',
      format: combine(
        errors({ stack: true }),
        timestamp(),
        json(),
        prettyPrint(),
      ),
      transports: [this.getFileTransport()],
    });
  }

  getFileTransport() {
    return new transports.File({ filename: 'logs/error.log' });
  }
}
