import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';
import { RESPONSE_CODES, RESPONSE_MESSAGES } from '../constants/response-codes';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let code: string;
    let message: string;
    let errors: string[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        code = responseObj.code || RESPONSE_CODES.INTERNAL_SERVER_ERROR;
        message = responseObj.message || exception.message;
        errors = responseObj.errors;
      } else {
        code = this.getErrorCodeFromStatus(status);
        message = exception.message || RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      code = RESPONSE_CODES.INTERNAL_SERVER_ERROR;
      message = RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR;
    }

    const apiResponse: ApiResponse = {
      success: false,
      code,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Log the error
    this.logger.error(
      `HTTP Exception: ${status} - ${message}`,
      exception instanceof Error ? exception.stack : 'Unknown error',
      {
        url: request.url,
        method: request.method,
        status,
        code,
        userAgent: request.get('User-Agent'),
        ip: request.ip,
      },
    );

    response.status(status).json(apiResponse);
  }

  private getErrorCodeFromStatus(status: HttpStatus): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return RESPONSE_CODES.BAD_REQUEST;
      case HttpStatus.UNAUTHORIZED:
        return RESPONSE_CODES.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return RESPONSE_CODES.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return RESPONSE_CODES.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return RESPONSE_CODES.CONFLICT;
      case HttpStatus.INTERNAL_SERVER_ERROR:
      default:
        return RESPONSE_CODES.INTERNAL_SERVER_ERROR;
    }
  }
}
