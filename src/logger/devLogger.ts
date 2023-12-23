/* eslint-disable class-methods-use-this */
import { createLogger, format, transports, Logger } from 'winston';
import { Injectable } from '@nestjs/common';
import { LoggerProvider } from './logger-provider.interface';

@Injectable()
export class DevLogger implements LoggerProvider {
  getLogger(): Logger {
    return createLogger({
      format: this.getFormat(),
      level: 'error',
      transports: [
        this.getErrorFileTransport(),
        this.getDebugConsoleTransport(),
        this.getErrorConsoleTransport(),
      ],
    });
  }

  getFormat() {
    const { combine, errors, timestamp, json, prettyPrint } = format;
    return combine(errors({ stack: true }), timestamp(), json(), prettyPrint());
  }

  getErrorFileTransport() {
    return new transports.File({
      filename: 'logs/error.log',
    });
  }

  getDebugFormat() {
    const { printf } = format;
    return printf(
      ({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`,
    );
  }

  getDebugConsoleTransport() {
    const { timestamp, combine, colorize } = format;
    return new transports.Console({
      level: 'debug',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize({
          level: true,
        }),
        this.getDebugFormat(),
      ),
    });
  }

  getErrorConsoleTransport() {
    const { errors, timestamp, combine, json, prettyPrint } = format;
    return new transports.Console({
      level: 'error',
      format: combine(
        errors({ stack: true }),
        timestamp(),
        json(),
        prettyPrint(),
      ),
    });
  }
}
