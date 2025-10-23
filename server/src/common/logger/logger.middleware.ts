// src/common/logger/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { Request, Response, NextFunction } from 'express';
import morgan = require('morgan');

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private morganMiddleware: any;

  constructor(private readonly logger: LoggerService) {
    // Configure morgan to use Winston
    this.morganMiddleware = morgan(
      ':method :url :status :response-time ms - :res[content-length]',
      {
        stream: {
          write: (message: string) => this.logger.log(message.trim()),
        },
      },
    );
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.morganMiddleware(req, res, next);
  }
}
