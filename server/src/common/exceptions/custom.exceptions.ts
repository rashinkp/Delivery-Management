import { HttpException, HttpStatus } from '@nestjs/common';
import { RESPONSE_CODES, RESPONSE_MESSAGES } from '../constants/response-codes';

export class AppException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    code: string = RESPONSE_CODES.INTERNAL_SERVER_ERROR,
  ) {
    super(
      {
        success: false,
        code,
        message,
        timestamp: new Date().toISOString(),
      },
      status,
    );
  }
}

export class ValidationException extends AppException {
  constructor(message: string = RESPONSE_MESSAGES.VALIDATION_ERROR, errors?: string[]) {
    super(message, HttpStatus.BAD_REQUEST, RESPONSE_CODES.VALIDATION_ERROR);
    this.getResponse()['errors'] = errors;
  }
}

export class UnauthorizedException extends AppException {
  constructor(message: string = RESPONSE_MESSAGES.UNAUTHORIZED) {
    super(message, HttpStatus.UNAUTHORIZED, RESPONSE_CODES.UNAUTHORIZED);
  }
}

export class ForbiddenException extends AppException {
  constructor(message: string = RESPONSE_MESSAGES.FORBIDDEN) {
    super(message, HttpStatus.FORBIDDEN, RESPONSE_CODES.FORBIDDEN);
  }
}

export class NotFoundException extends AppException {
  constructor(message: string = RESPONSE_MESSAGES.NOT_FOUND) {
    super(message, HttpStatus.NOT_FOUND, RESPONSE_CODES.NOT_FOUND);
  }
}

export class ConflictException extends AppException {
  constructor(message: string = RESPONSE_MESSAGES.CONFLICT) {
    super(message, HttpStatus.CONFLICT, RESPONSE_CODES.CONFLICT);
  }
}

export class DuplicateEntryException extends AppException {
  constructor(message: string = RESPONSE_MESSAGES.DUPLICATE_ENTRY) {
    super(message, HttpStatus.CONFLICT, RESPONSE_CODES.DUPLICATE_ENTRY);
  }
}

export class InvalidCredentialsException extends AppException {
  constructor(message: string = RESPONSE_MESSAGES.INVALID_CREDENTIALS) {
    super(message, HttpStatus.UNAUTHORIZED, RESPONSE_CODES.INVALID_CREDENTIALS);
  }
}

export class TokenExpiredException extends AppException {
  constructor(message: string = RESPONSE_MESSAGES.TOKEN_EXPIRED) {
    super(message, HttpStatus.UNAUTHORIZED, RESPONSE_CODES.TOKEN_EXPIRED);
  }
}

export class InsufficientPermissionsException extends AppException {
  constructor(message: string = RESPONSE_MESSAGES.INSUFFICIENT_PERMISSIONS) {
    super(message, HttpStatus.FORBIDDEN, RESPONSE_CODES.INSUFFICIENT_PERMISSIONS);
  }
}
