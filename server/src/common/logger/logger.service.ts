import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      defaultMeta: { service: 'wholesale-delivery-api' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // Custom methods for structured logging
  logRequest(method: string, url: string, userAgent?: string, ip?: string) {
    this.logger.info('HTTP Request', {
      method,
      url,
      userAgent,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  logResponse(method: string, url: string, statusCode: number, responseTime: number) {
    this.logger.info('HTTP Response', {
      method,
      url,
      statusCode,
      responseTime,
      timestamp: new Date().toISOString(),
    });
  }

  logDatabaseQuery(query: string, parameters?: any[], executionTime?: number) {
    this.logger.debug('Database Query', {
      query,
      parameters,
      executionTime,
      timestamp: new Date().toISOString(),
    });
  }

  logBusinessLogic(operation: string, entity: string, id?: string, details?: any) {
    this.logger.info('Business Logic', {
      operation,
      entity,
      id,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  logSecurityEvent(event: string, details: any) {
    this.logger.warn('Security Event', {
      event,
      details,
      timestamp: new Date().toISOString(),
    });
  }
}
