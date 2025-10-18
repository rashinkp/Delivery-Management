import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    
    const { method, url, ip } = request;
    const userAgent = request.get('User-Agent') || '';
    const startTime = Date.now();

    // Log request
    this.logger.log(
      `Incoming Request: ${method} ${url} - ${userAgent} - ${ip}`,
      `${context.getClass().name}.${context.getHandler().name}`,
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - startTime;
          this.logger.log(
            `Outgoing Response: ${method} ${url} - ${response.statusCode} - ${responseTime}ms`,
            `${context.getClass().name}.${context.getHandler().name}`,
          );
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          this.logger.error(
            `Request Error: ${method} ${url} - ${error.status || 500} - ${responseTime}ms - ${error.message}`,
            error.stack,
            `${context.getClass().name}.${context.getHandler().name}`,
          );
        },
      }),
    );
  }
}
