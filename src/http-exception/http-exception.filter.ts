// @todo: this just handles that http errors, implment another layer which handles all exceptions
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { MyLoggerService } from 'src/logger/myLogger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: MyLoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.error(
      `${request.method} ${request.url}`,
      exception.stack,
      'HttpExceptionFilter',
    );

    response.status(status).json({
      message: exception.message,
      stack: exception.stack,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
