// src/common/logger/logger.service.ts
import {
  Injectable,
  LoggerService as NestLoggerService,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  log(message: string, context?: string) {
    const logMessage = context ? `[${context}] ${message}` : message;
    this.logger.info(logMessage);
  }

  error(message: string, trace?: string, context?: string) {
    const logMessage = context ? `[${context}] ${message}` : message;
    if (trace) {
      this.logger.error(`${logMessage} - Stack: ${trace}`);
    } else {
      this.logger.error(logMessage);
    }
  }

  warn(message: string, context?: string) {
    const logMessage = context ? `[${context}] ${message}` : message;
    this.logger.warn(logMessage);
  }

  debug(message: string, context?: string) {
    const logMessage = context ? `[${context}] ${message}` : message;
    this.logger.debug(logMessage);
  }

  verbose(message: string, context?: string) {
    const logMessage = context ? `[${context}] ${message}` : message;
    this.logger.verbose(logMessage);
  }

  // Additional utility methods
  fatal(message: string, trace?: string, context?: string) {
    const logMessage = context ? `[${context}] ${message}` : message;
    if (trace) {
      this.logger.error(`${logMessage} - Stack: ${trace}`);
    } else {
      this.logger.error(logMessage);
    }
  }
}
