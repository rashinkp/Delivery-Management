import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { jwtConfig } from '../config/jwt.config';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly logger: LoggerService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Extract JWT from HTTP-only cookie
          return request?.cookies?.access_token;
        },
        // Fallback to Authorization header for API testing
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: any) {
    // Log successful authentication
    this.logger.log(
      `🔐 Auth successful: ${payload.role} (${payload.email || payload.mobile})`,
      'Auth',
    );

    // The returned object will be available in req.user
    return {
      sub: payload.sub,
      role: payload.role,
      email: payload.email,
      mobile: payload.mobile,
    };
  }
}
