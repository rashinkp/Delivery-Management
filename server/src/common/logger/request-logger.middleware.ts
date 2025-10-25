import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, url, ip } = req;
    
    // Log incoming request
    this.logger.log(
      `📥 ${method} ${url} - IP: ${ip}`,
      'Request'
    );

    // Override res.end to log response
    const originalEnd = res.end;
    const self = this;
    res.end = function(chunk?: any, encoding?: any) {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;
      
      // Log response with appropriate level
      if (statusCode >= 400) {
        self.logger.warn(
          `📤 ${method} ${url} - ${statusCode} - ${duration}ms`,
          'Response'
        );
      } else {
        self.logger.log(
          `📤 ${method} ${url} - ${statusCode} - ${duration}ms`,
          'Response'
        );
      }

      return originalEnd.call(this, chunk, encoding);
    };

    next();
  }
}
