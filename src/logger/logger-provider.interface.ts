import { Logger } from 'winston';

export interface LoggerProvider {
  getLogger(): Logger;
}
