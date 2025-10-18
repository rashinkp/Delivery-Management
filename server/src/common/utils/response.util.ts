import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { RESPONSE_CODES, RESPONSE_MESSAGES, HTTP_STATUS_CODES } from '../constants/response-codes';

export class ResponseUtil {
  static success<T>(
    data: T,
    message: string = RESPONSE_MESSAGES.SUCCESS,
    code: string = RESPONSE_CODES.SUCCESS,
  ): ApiResponse<T> {
    return {
      success: true,
      code,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static created<T>(
    data: T,
    message: string = RESPONSE_MESSAGES.CREATED,
    code: string = RESPONSE_CODES.CREATED,
  ): ApiResponse<T> {
    return {
      success: true,
      code,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static updated<T>(
    data: T,
    message: string = RESPONSE_MESSAGES.UPDATED,
    code: string = RESPONSE_CODES.UPDATED,
  ): ApiResponse<T> {
    return {
      success: true,
      code,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static deleted(
    message: string = RESPONSE_MESSAGES.DELETED,
    code: string = RESPONSE_CODES.DELETED,
  ): ApiResponse<null> {
    return {
      success: true,
      code,
      message,
      data: null,
      timestamp: new Date().toISOString(),
    };
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = RESPONSE_MESSAGES.SUCCESS,
    code: string = RESPONSE_CODES.SUCCESS,
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / limit);
    
    return {
      success: true,
      code,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      timestamp: new Date().toISOString(),
    };
  }

  static error(
    message: string,
    code: string = RESPONSE_CODES.INTERNAL_SERVER_ERROR,
    errors?: string[],
  ): ApiResponse<null> {
    return {
      success: false,
      code,
      message,
      errors,
      timestamp: new Date().toISOString(),
    };
  }
}
