import { Injectable } from '@nestjs/common';
import { MyLoggerService } from './logger/myLogger.service';

@Injectable()
export class AppService {
  constructor(private readonly logger: MyLoggerService) {}

  getHello(): string {
    this.logger.verbose('test log');
    return 'Hello World!';
  }
}
